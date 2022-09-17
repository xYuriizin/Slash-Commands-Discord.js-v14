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

  const guilds = ['925092527168700436', '955093002001481788', '1007365207905026088', '808717459695599636', '905867817600049173']
  
  client.on("ready", () => {
    console.log(client.user.username + ' Está online e funcional!') //...
    console.log("Slash Commands | OK!") //avisando no console
    guilds.map(x => client.guilds.cache.get(x).commands.set(SlashCommands)) //client.guilds.cache.get("808717459695599636").commands.set(SlashCommands)
    /**
     * caso queira que os comandos seja globais, use:
     * client.application.commands.set(SlashCommands)
     */
  })

}