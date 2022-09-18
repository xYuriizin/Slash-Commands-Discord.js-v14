const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } = require("discord.js") //...
const { unabbreviate } = require("util-stunks") //usado para transformar "20k" em 20000 por exemplo!

module.exports = {
  name: "pay",
  description: "[💸 ECONOMIA] Envie Coins para o seu amigo!",
  options: [
    {
      name: "user",
      description: "Para quem é o pagamento?",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "quantidade",
      description: "Quantos coins você quer enviar? (você pode usar 10k, 1m etc!)",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async (client, interaction) => {
    const User = interaction.options.getUser("user")
    const quantity = unabbreviate(interaction.options.getString("quantidade"))
    const data = await client.database.users.get(interaction.user.id) //pegando os dados do usuario na database
    const coins = data?.coins ?? 0 //quantos coins o autor tem?

    if(User.id === interaction.user.id) return interaction.reply({ //não pode enviar para ele mesmo... certo?
      content: `${interaction.user} você não pode enviar coins para sí! Bobão.`
    })

    if(isNaN(quantity) || quantity < 10 || !quantity) return interaction.reply({ //se o user inserir menos de 10 coins
      content: `${interaction.user} informe quantos coins você quer enviar e que seja maior que **10**.`
    })
    if(coins < quantity) return interaction.reply({ //se caso ele n tiver aa quantidade fornecida..
      content: `${interaction.user} infelizmente você não tem **${quantity.toLocaleString("pt-BR")}** coins.`
    })

    const button = new ActionRowBuilder() //criando um botão para ser adicionado e usado para confirmar o pagamento
    .addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("confirm")
      .setLabel("Confirmar")
    )

    const embed = new EmbedBuilder()
    .setTitle("Pagamento")
    .setColor("Green")
    .setTimestamp()
    .setDescription(`💸 ${interaction.user} Para confirmar que você deseja enviar **${quantity.toLocaleString("pt-BR")}** coins para **${User.tag}** clique no botão.`)

    let msg = await interaction.reply({ //enviando a msg para aguardar a confirmação do autor
      content: interaction.user.toString(),
      components: [button],
      embeds: [embed],
      fetchReply: true
    })

    let collector = msg?.createMessageComponentCollector({ //criando um coletor para qnd o autor clicar no botão
      filter: (int) => int.user.id === interaction.user.id, //só queremos que o autor confirme o pagamento, certo?
      time: 60000, //o autor vai ter até 1 minuto para confirmar
      max: 1 //o autor só poderá clicar uma vez no botão!
    })

    collector.on("collect", async (int) => { //quando o botão for pressionado...
      await int.deferUpdate().catch(() => { })
      if(int.user.id !== interaction.user.id) return int.followUp({ //enviando uma msg se outra pessoa senão o autor clicar no botão
        content: "Você não pode clicar aqui.",
        ephemeral: true
      })

      const DataCheck = await client.database.users.get(interaction.user.id) //pegando os dados do usuario na database
      const CoinsCheck = DataCheck?.coins ?? 0 //quantos coins o autor tem?

      if(CoinsCheck < quantity) { //se o usuario ficar sem a quantidade inicial após enviar o comando ele n poderá enviar o pagamento
        return msg.edit({
          content: `Opa ${interaction.user}, você não tem mais **${quantity.toLocaleString("pt-BR")}** coins!\nComando cancelado.`,
          components: []
        })
      }

      msg.edit({
        content: `${interaction.user} pagamento de **${quantity.toLocaleString("pt-BR")}** coins para **${User.tag}** confirmado.`,
        embeds: [],
        components: []
      })

      int.followUp({
        content: `${User}, ${interaction.user} acaba de te enviar **${quantity.toLocaleString("pt-BR")}** coins!`
      })

      await client.database.users.add(User.id + '.coins', quantity) //adicionando os coins ao usuario
      await client.database.users.sub(interaction.user.id + '.coins', quantity) //removendo os coins do autor

    }) 

    collector.on("end", async () => { //quando se passar 1 minuto esse evento é acionado
      if(msg?.components) return msg?.edit({ components: [] }) //se o autor n tiver confirmado o pagamento, o bot remove o botão!
    })

  }
}