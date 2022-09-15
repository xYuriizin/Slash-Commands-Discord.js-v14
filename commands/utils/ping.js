module.exports = {
  name: "ping",
  description: "Veja minha latência!",
  run: async(client, interaction) => {
    interaction.reply({
      content: "**" + client.ws.ping + "ms**",
      ephemeral: true
    })
  }
}