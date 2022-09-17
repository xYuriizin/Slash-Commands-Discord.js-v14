const { durationTime } = require("util-stunks") //requerindo o módulo usado para formatação do tempo! (créditos: costa.dnl#5689)
const ms = require("ms") //package usada para transformar milissegundos em tempo legível e vice-e-versa

module.exports = {
  name: "daily", //nome do comando...
  description: "[💸 ECONOMIA] Colete seus coins de hoje!", //...
  run: async (client, interaction) => {
    let cooldown = ms("24h") //tempo de intervalo de 24h para coletar o daily novamente
    let data = await client.database.users.get(interaction.user.id)

    if(data?.cooldowns?.daily !== null && data?.cooldowns?.daily > Date.now()) { //se o user estiver no cooldown
      let time = durationTime(data?.cooldowns?.daily, { displayAtMax: 3, removeMs: true }) //o tempo que falta para usar o comando novamente...
      return interaction.reply({
        content: `Opa ${interaction.user}, espere mais **${time}** para coletar o daily novamente bobinho!`
      })
    }

    let value = parseInt(Math.random() * (20_000 - 1_500 + 1)) //gerando um valor aleatório entre 1.500 e 20.000 Coins!

    await client.database.users.add(`${interaction.user.id}.coins`, value) //adicionando os coins ao usuario
    await client.database.users.set(`${interaction.user.id}.cooldowns.daily`, parseInt(Date.now() + cooldown)) //setando o cooldown para 24h

    interaction.reply({ //enviando a mensagem!
      content: `${interaction.user} Parabéns! Hoje você coletou **${value.toLocaleString("pt-BR")}** Coins!\nVolte em **24h** para coletar novamente.`
    })

  }
}