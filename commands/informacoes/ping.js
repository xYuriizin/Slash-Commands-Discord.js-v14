module.exports = {
  name: "ping",
  description: "[ℹ INFORMAÇÕES] Veja minha latência!",
  run: async(client, interaction) => {

    let msg = await interaction.reply({
      content: "calculando...",
      fetchReply: true
    })

    msg.edit({
      content: `**${client.ws.ping}ms**`
    })
  }
}