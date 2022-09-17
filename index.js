const { Client, Collection, GatewayIntentBits } = require("discord.js")
const { QuickDB } = require("quick.db") //chamando o módulo quick.db (banco de dados que vou utilizar)
const db = new QuickDB() //criando uma database

require("dotenv").config() 

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

client.database = { //criando um objeto para melhor manuseio da database
  users: db.table("users"),
  guilds: db.table("guilds")
}
client.commands = new Collection()
client.login(process.env.TOKEN_BOT) //coloque seu token aqui!

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
  } else if(interaction.type === 5) { //responder ao modal do comando de eval!
    await interaction.deferUpdate().catch(() => { }) //se caso acontecer algum erro não fazer o bot cair...

    let code = interaction.fields.getTextInputValue("evalCode") //pegando o código que você colocou no modal
    const { inspect } = require("util")
    let res;
    try {
      res = await eval(code)
      if (typeof res !== "string") res = await inspect(res) //definindo o resultado do código após ser executado
    } catch (e) {
      res = e.message //se caso der erro no seu código, o resultado será o erro
    }

    return interaction.followUp({ //respondendo ao eval somente para você (evitar vazar tokens e afins né kk)
      content: "```js\n" + res.slice(0, 1980)  + "\n```", //não queremos que passe do limite máximo de caracteres né...
      ephemeral: true
    })

  }
})

module.exports = client
require("./handler/index.js")(client) //executa a handler de comandos (para não ficar tudo bagunçado na index)