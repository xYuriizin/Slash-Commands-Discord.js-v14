const { Client, Collection, GatewayIntentBits } = require("discord.js")

const client = new Client({ //instanciando seu client (bot)!
intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ] //definindo as intents para o seu bot
})

client.commands = new Collection()
client.login("TOKEN") //coloque seu token aqui!

client.on("interactionCreate", async (interaction) => {
  if(interaction.isCommand()) { //verificando se a interação é um Slash Command (Comando de /)
    try {
      let command = client.commands.get(interaction.commandName) //verifica se o comando existe (e é desse projeto, ou seja, comandos que n estão configurados nesse projeto não funcionarão)
      if(!command) return; //se o comando não exidtir cancela tudo.
      command.run(client, interaction) //roda o comando
    } catch(e) { //se caso acontecer algum erro, envia no chat de forma efemera!
      interaction.reply({
        content: "Error: `" + e.message + "`",
        ephemeral: true
      })
    }
  }
})

module.exports = client
require("./handler/index.js")(client) //executa a handler de comandos (para não ficar tudo bagunçado na index)