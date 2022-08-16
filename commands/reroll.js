const {EmbedBuilder} = require("discord.js");
const Discord = require("discord.js")
const ms = require("ms")
exports.run = async (client, message, args) => {
let gwId = args[0];
  if(!gwId) return message.channel.send("Lütfen bir çekiliş ID gir!")
  let End = client.db.fetch(`gwReroll_${message.guild.id}`);
  let Id = client.db.fetch(`gwEnd_${message.guild.id}`);
  if(!Id) return message.channel.send("Böyle bir çekiliş bulunamadı!");
  if(!End) {
    return message.channel.send("Bu çekiliş daha sona ermemiş!")
  } else {
    if(Id.key == gwId) {
      let channel = Id.channel;
      let key = client.db.fetch(`gwUsers_${message.guild.id}`);
      if(!key) {
       
     
          client.channels.cache.get(channel).send(`Not enough entrants to determine a winner!`)
        
      } else {
        let winners = client.db.get(`gwUsers_${message.guild.id}`)[Math.floor(Math.random()*client.db.get(`gwUsers_${message.guild.id}`).length)];
       
          return client.channels.cache.get(channel).send(`:tada: The new winner is <@${winners}>, Congratulations!`)
        
      }
    }
      return message.channel.send("hata oluştu");
    }
  };

exports.conf = {
  aliases: []
};

exports.help = {
  name: "reroll"
};
