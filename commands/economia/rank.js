const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "rank",
  description: "[💸 ECONOMIA] Veja os usuários mais ricos de coins!",
  run: async (client, interaction) => {
    const allValues = await client.database.users.all() //pegando todos os usuários da database
    const sorted = allValues.sort((a, b) => b.value.coins - a.value.coins).slice(0, 10) //organizando do mais rico ao mais pobre KKK

    const mapped = await Promise.all(sorted.map(async (x, i) => { //mapeando a array para retornar a mensagem do rank (sinta-se a vontade para decorar como quiser!)
      let user = await client.users.fetch(x.id) //pegando o usuário para adicionar a tag dele no rank
      return `\`${++i}\` - **${user?.tag}** Possui **${x.value.coins.toLocaleString("pt-BR")}** Coins` //retornando a mensagem
    }))

    const embed = new EmbedBuilder() //criando uma embed simples
    .setTitle("Usuários mais ricos")
    .setDescription(mapped.join("\n"))
    .setColor("White")
    .setTimestamp()

    interaction.reply({ //e finalmente enviando o rank!
      content: interaction.user.toString(),
      embeds: [embed]
    })
  }
}