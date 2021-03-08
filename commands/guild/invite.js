const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { invite } = require('../../config.json');

// Only if invite is in config.json and set to true
if (!invite) return;

module.exports = class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'guild',
      memberName: 'invite',
      description: 'Replies with a link to invite the bot.'
    });
  }

  async run(message) {
    //provides the link with admin permissions
    const inviteURL = `https://https://discord.com/oauth2/authorize?client_id=745140889755844680&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D745140889755844680%26scope%3Dbot%26permissions%3D3525704&response_type=code&scope=identify%20applications.commands%20bot%20email%20guildsth2/authorize?client_id=745140889755844680&scope=bot&permissions=3525704`;

    const guildCacheMap = this.client.guilds.cache;
    const guildCacheArray = Array.from(guildCacheMap, ([name, value]) => ({
      name,
      value
    }));
    let memberCount = 0;
    for (let i = 0; i < guildCacheArray.length; i++) {
      memberCount = memberCount + guildCacheArray[i].value.memberCount;
    }

    const embed = new MessageEmbed()
      .setTitle(this.client.user.username)
      .setColor('RANDOM')
      .setImage('https://images-ext-2.discordapp.net/external/onJIE1enNij8oh8MOcP9o7Ds3lN2jKU7pWZsPOxqUHA/https/media.discordapp.net/attachments/601060403941736460/702530987598413864/Tw.gif')
      .setURL(inviteURL)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setDescription(`You can [Click me](https://https://discord.com/oauth2/authorize?client_id=745140889755844680&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D745140889755844680%26scope%3Dbot%26permissions%3D3525704&response_type=code&scope=identify%20applications.commands%20bot%20email%20guildsth2/authorize?client_id=745140889755844680&scope=bot&permissions=3525704) so that you can add me into your server <a:785584094637195304:794108590285520936>`
      )
      .setFooter(
        'Operated by ' + this.client.owners[0].username + ' since',
        this.client.owners[0].displayAvatarURL()
      )
      .setTimestamp(this.client.user.createdAt);

   message.reply(embed);
  }
};