const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
  name: "say",
  description: "[🛠 UTILIDADES] Me faça falar algo!",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "O que eu devo falar?",
      name: "message"
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      required: false,
      description: "Devo responder de forma efemera?",
      name: "ephemeral"
    }
  ],
  run: async(client, interaction) => {
    const argument = interaction.options.getString("message") //o conteúdo que o bot vai enviar no canal!
    const hide = interaction.options.getBoolean('ephemeral') || false //se o usuário quiser que a mensagem apareça só para ele

    interaction.reply({
      content: "Mensagem enviada por: **" + interaction.user.tag + "**\n" + argument.replace(/@/g, "@\u200b"),
      ephemeral: hide
    })

  }
}