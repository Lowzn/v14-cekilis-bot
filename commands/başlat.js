const {EmbedBuilder} = require("discord.js");
const Discord = require("discord.js")
const ms = require("ms")
exports.run = async (client, message, args) => {
let time = args[0];
  let winnersCount = args[1];
  let prize = args.slice(2).join(" ");
  if(!time) return message.channel.send("Lütfen bir zaman gir!");
  if(!winnersCount) return message.channel.send("Lütfen bir kazanan sayısı gir!");
  if(!prize) return message.channel.send("Lütfen bir ödül gir!")
  let gwTime = ms(time);
  let gwEmbed = new EmbedBuilder()
  .setDescription(`Düzenleyen: ${message.author}\nSüre: <t:${Math.floor(Date.now() /1000) + Math.floor(gwTime/1000)}:R>\nKazanan: **${winnersCount}**`)
  .setColor('#5865f2')
  .setTitle(`${prize}`)
  .setTimestamp()
const row = new Discord.ActionRowBuilder()
.addComponents(
  new Discord.ButtonBuilder()
  .setStyle(Discord.ButtonStyle.Primary)
  .setLabel('Enter')
  .setEmoji('🎉')
  .setCustomId('gwButton'))
  let msg = await message.channel.send({embeds: [gwEmbed], components: [row] }).then(me => {
    let channelId = message.channel.id;
    let msgId = me.id;
    client.db.set(`gwEnd_${message.guild.id}`, { key: msgId, prize: prize, channel: channelId });
    async function edit() {
      let winners = client.db.get(`gwUsers_${message.guild.id}`)[Math.floor(Math.random()*client.db.get(`gwUsers_${message.guild.id}`).length)];
      let a = client.db.get(`gwUsers_${message.guild.id}`).length
      let gwEndedEmbed = new EmbedBuilder()
      .setDescription(`Sona Erdi: <t:${Math.floor(Date.now() /1000)}:R> (<t:${Math.floor(Date.now() /1000)}:f>)\nKazanan: <@${winners}>\nKatılımcı: ${a} (Katılımcı Yanlış Çıkabilir)`)
      .setTitle(`${prize}`)
        .setColor('#5865f2')
   
    
      me.edit({embeds: [gwEndedEmbed], components: []}).then(() => {
        client.db.delete(`gwEntry_${message.guild.id}`),
        client.channels.cache.get(channelId).send(`Congratulations <@${winners}>, you won the **${prize}**!`)
      })
    }
    async function lockGw() {
      let gwEndedEmbed1 = new EmbedBuilder()
      .setDescription(`:gift: Prize: **${prize}**\n:joy: Winner(s): **No winners!**`)
      .setColor('BLURPLE')
      .setTimestamp()

      me.edit({ embed: gwEndedEmbed1 }).then(() => {
        client.db.delete(`gwEntry_${message.guild.id}`),
        client.channels.cache.get(channelId).send(`Not enough entrants to determine a winner!`)
      })
    }
    message.delete();
  me.createMessageComponentCollector(user => user.clicker.user.id == message.author.id).on('collect', async (button) => {
      let interaction = button
        if (interaction.customId == "gwButton") {
        let userId = interaction.user.id
        interaction.reply({content: `Başarıyla Çekilişe Katıldın.`, ephemeral: true})
        client.db.push(`gwUsers_${message.guild.id}`, userId)
      };
    });
    setTimeout(function() {
      let g = client.db.fetch(`gwUsers_${message.guild.id}`);
      if(!g) {
        lockGw()
        client.db.set(`gwReroll_${message.guild.id}`, { Set: 2 });
      } else {
        edit()
        client.db.set(`gwReroll_${message.guild.id}`, { Set: 1 });
      };
    }, gwTime);
  });
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "başlat"
};
