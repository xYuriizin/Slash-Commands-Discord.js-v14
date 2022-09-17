const { EmbedBuilder } = require("discord.js")
const { readdirSync } = require("fs")

module.exports = {
  name: "help",
  description: "[ℹ INFORMAÇÕES] Veja a lista dos meus comandos!",
  run: async (client, interaction) => {
    const dirs = readdirSync("./commands/") //lendo as pastas dentro da pasta "commands"
    let fields = [] //vou usar para adicionar um field na embed...

    dirs.forEach((folder) => { //navegando por cada uma das pastas de "commands"
      if(folder === "owner") return; //não queremos que mostre os comandos que só o dono pode usar, certo? não tem sentido mostrar!
      const commands = readdirSync(`./commands/${folder}/`) //listando todos os comandos dentro das sub-pastas de "commands"
      let list = commands.map((cmd) => { //mapeando os comandos para colocar na variavel "fields"
        const cmdName = cmd.split(".")[0] //pegando o nome do comando (lembre-se: o nome do arquivo precisa ser igual o do comando em sí! para evitar erros)
        const Command = require(`../../commands/${folder}/${cmdName}`) //puxando o comando
        return Command?.name || "Comando desconhecido" //retornando apenas o nome do comando, ou caso n achar o comando retornar "comando desconhecido"
      })
      const obj = { //objeto para ser adicionado aos fields
        name: folder.charAt(0).toUpperCase() + folder.slice(1), //nome do field
        value: list.map(x => `\`/${x}\``).join(", ") //valor dos fields (os comandos!)
      }
      fields.push(obj) //adicionando aos fields
    })

    const embed = new EmbedBuilder() //criando uma embed simples...
    .setTitle("Paínel de ajuda - " + client.user.username)
    .setColor("White")
    .setDescription("Confira todos os meus comandos!")
    .setThumbnail(client.user.displayAvatarURL())

    if(fields.length >= 1) embed.addFields(fields)

    interaction.reply({ //respondendo ao comando, finalmente!!!
      content: interaction.user.toString(),
      embeds: [embed]
    })

  }
}