const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
  name: "atm",
  description: "[💸 ECONOMIA] Veja quantos coins você tem!",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      required: false,
      description: "Quer ver os coins de outro usuário?",
      name: "user"
    }
  ],
  run: async(client, interaction) => {
    let User = interaction.options.getUser("user") || interaction.user
    if(!User) try {
      User = await client.users.fetch(User) //tentar der fetch se caso o autor inserir um ID
    } catch(e) {
      User = User
    }

    let data = await client.database.users.get(User.id) //pegando as informações do usuário da database
    let coins = data?.coins ?? 0 //se caso o usuário não estiver registrado, os coins dele será 0!

    let msg = User.id === interaction.user.id ? `Você tem **${coins.toLocaleString("pt-BR")}** Coins!` : `${User} tem **${coins.toLocaleString("pt-BR")}** Coins!` //uma mensagem mais organizada e bonita

    await interaction.reply({
      content: msg
    })
  }
}