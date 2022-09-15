const { readdirSync } = require("fs")

module.exports = async (client) => {
  const SlashCommands = []
  
  readdirSync("./commands").forEach(folder => {
    const files = readdirSync(`./commands/${folder}/`)
    for(let arq of files) {
      let command = require(`../commands/${folder}/${arq}`)
      if(command) { //se caso o diretório existir
        SlashCommands.push(command) //adicionando o comando para ser utilizado
        client.commands.set(command?.name, command) //salvando o comando em uma Collection
      }
    }
  })

  console.log(SlashCommands) //você pode deletar isso se quiser, só adicionei para checar se tudo estava nos conformes!
  
  client.on("ready", () => {
    console.log(client.user.username + ' Está online e funcional!') //...
    console.log("Slash Commands | OK!") //avisando no console
    client.guilds.cache.get("808717459695599636").commands.set(SlashCommands) //comando locais (em um único servidor)
    /**
     * caso queira que os comandos seja globais, apage a linha de cima e use:
     * client.application.commands.set(SlashCommands) //lembrando que demora cerca de ~1h para os comandos aparecerem
     */
  })

}
