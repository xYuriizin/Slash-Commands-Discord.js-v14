const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
  name: "eval",
  description: "[🔐 DEVELOPER] Execute um código JavaScript",
  run: async(client, interaction) => {
    
    if(interaction.user.id !== process.env.OWNER) return interaction.reply({
      content: "somente meu dono pode usar esse comando.",
      ephemeral: true
    })

    const modal = new ModalBuilder()
    .setCustomId(`eval_${interaction.user.id}`)
    .setTitle('Executar código JS')

    const code = new TextInputBuilder()
    .setCustomId('evalCode')
    .setLabel("Qual código será executado?")
    .setPlaceholder("console.log('Hello Word!')")
    .setStyle(TextInputStyle.Paragraph)

    const rowModal = new ActionRowBuilder().addComponents(code)
    modal.addComponents(rowModal)

    interaction.showModal(modal)

  }
}