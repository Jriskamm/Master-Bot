const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js')
const { Structures, MessageEmbed, MessageAttachment } = require('discord.js');
const path = require('path');
const { prefix, token, discord_owner_id } = require('./config.json');
const db = require('quick.db');
const SnakeGame = require('./snake-game');
const HangmanGame = require('./hangman-game');
const Connect4 = require('./connect4');
const Chess = require('./chess');

Structures.extend('Guild', function(Guild) {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        skipTimer: false, // only skip if user used leave command
        loopSong: false,
        loopQueue: false,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
    resetMusicDataOnError() {
      this.musicData.queue.length = 0;
      this.musicData.isPlaying = false;
      this.musicData.nowPlaying = null;
      this.musicData.loopSong = false;
      this.musicData.loopQueue = false;
      this.musicData.songDispatcher = null;
    }
  }
  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: discord_owner_id
});

const snakeGame = new SnakeGame(client);
const hangman = new HangmanGame(client);
const connect4 = new Connect4(client);
const chess = new Chess(client);

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['music', ':notes: Music Command Group:'],
    ['gifs', ':film_frames: Gif Command Group:'],
    ['other', ':loud_sound: Other Command Group:'],
    ['guild', ':gear: Guild Related Commands:'],
    ['speedrun', ':athletic_shoe: Speedrun Related Commands:']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({ eval: false, prefix: false, commandState: false, help: false, unknownCommand: false })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log(`${client.user.tag} is connected to Discord successfully!`);
  client.user.setActivity(`@Bunch`, {
    type: 'LISTENING',
    url: 'https://www.twitch.tv/jriskam'
  });
});


client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    newState.guild.musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
    return;
  }
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
});

client.on('guildCreate', guild => {
  let channelID
      let channels = guild.channels.cache
      channelLoop:
      for (let c of channels) {
        let channelType = c[1].type
        if (channelType === "text") {
            channelID = c[0]
            break channelLoop
          }
      }  
      let channel = client.channels.cache.get(guild.systemChannelID || channelID)

      channel.send(new Discord.MessageEmbed()
      .setTitle("Thanks for adding me into your server!!")
      .addField('**_Bunch Discord Bot_** <:Bunch:782263094008872981>','To get started, join a voice channel and `/play` a song! You can use song names, video links, and playlist links. A full list of commands is available [here](https://docs.google.com/document/d/1cRUb67XddISl5qJEl4ag5aOAyMEHNBC9w_3t2LFvXrk/edit?usp=sharing) or by typing the command: `/help`. \n\nIf you have any questions or need help with Bunch, [click here](https://discord.gg/WkJGTekDZp) to join our support server')
      .setColor("RANDOM")
      )
    })


            client.on('message', async message => {
              const args = message.content.substring(prefix.length).split(" ")
              if (message.content.startsWith(`${prefix}help`)) {
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Bunch Commands')
                .setURL('https://docs.google.com/document/d/1cRUb67XddISl5qJEl4ag5aOAyMEHNBC9w_3t2LFvXrk/edit?usp=sharing')
                .setThumbnail('https://media.discordapp.net/attachments/781434598617120778/787749668045848636/20201213_174419.gif')
                .addField('<a:772308797842128897:786918359605444618> Music Play', '`/play` `/pause` `/resume` `/now-playing` `/leave` `/volume` `/queue` `/remove` `/lyrics` `/join` `/shuffle` `/skip` `/skipall` `/skipto` `/move` `/loop` `/loopqueue`')
                .addField('<a:772308797842128897:786918359605444618> Music Playlist', '`/create-playlist` `/my-playlists` `/delete-playlist` `/display-playlist` `/remove-from-playlist` `/save-to-playlist`')
                .addField('<a:772308797842128897:786918359605444618> Music Quiz', '`/music-trivia` `/stop-trivia`')
                .addField('<a:734088088648679445:808730284811616316> Games', '`/chess` `/snake` `/hangman` `/connect4`')
                .addField('<a:587566059855282196:806942542787903578> Extras', '`/help` `/ping` `/invite` `/support` `/paypal` `/feedback`')
                .setFooter('Join our Discord Server now! Link: https://discord.gg/WkJGTekDZp')
                .setImage('https://media.discordapp.net/attachments/601060403941736460/702530987598413864/Tw.gif')
                message.channel.send(embed)
              }
            })

            client.on('message', async message => {
              const args = message.content.substring(prefix.length).split(" ")
              if (message.content.startsWith(`${prefix}paypal`)) {
                const embed = new Discord.MessageEmbed()
                  .setColor('RANDOM')
                  .setTitle('Want to support me for my development?')
                  .setURL('https://www.paypal.me/jriskam')
                  .setDescription('<a:741402474098851841:797871278194819072> Every cents count! All donations will be used in the Development of Bunch. Do drop a note of your Discord Username, so that i can thank you! \nhttps://www.paypal.me/jriskam')
                  .setFooter('Bunch', 'https://media.discordapp.net/attachments/781434598617120778/782262504617148486/PicsArt_11-28-11.01.00.png?width=669&height=667')
                  message.channel.send(embed)
                
              }
            })

            client.on('message', async message => {
              const args = message.content.substring(prefix.length).split(" ")
              if (message.content.startsWith(`${prefix}support`)) {
                const embed = new Discord.MessageEmbed()
                  .setColor('RANDOM')
                  .setTitle('Want to join our Discord Server?')
                  .setURL('https://discord.gg/WkJGTekDZp')
                  .setImage('https://images-ext-2.discordapp.net/external/onJIE1enNij8oh8MOcP9o7Ds3lN2jKU7pWZsPOxqUHA/https/media.discordapp.net/attachments/601060403941736460/702530987598413864/Tw.gif')
                  .setDescription('<a:786905733488574484:787128851993591828> [Click me](https://www.discord.gg/WkJGTekDZp) to join!')
                  .setFooter('Bunch', 'https://media.discordapp.net/attachments/781434598617120778/782262504617148486/PicsArt_11-28-11.01.00.png?width=669&height=667')
                  message.channel.send(embed)
                
              }
            })

            client.on('message', async message => {
              const args = message.content.substring(prefix.length).split(" ")
              if (message.content.startsWith(`${prefix}feedback`)) {
                const embed = new Discord.MessageEmbed()
                  .setColor('RANDOM')
                  .setDescription(`**<a:778203523896573952:797926225284431922> Hey <@${message.author.id}>, leave some suggestions & feedbacks for us? Click the link below** \nhttps://forms.gle/hpDnjSpjWHsPku779`)
                  .setFooter('Bunch', 'https://media.discordapp.net/attachments/781434598617120778/782262504617148486/PicsArt_11-28-11.01.00.png?width=669&height=667')
                  message.channel.send(embed)
                
              }
            })

            client.on('message', async message => {
              const args = message.content.substring(prefix.length).split(" ")
              if (message.content.startsWith(`${prefix}lyrics`)) {
                message.reply(new Discord.MessageEmbed()
                  .setColor('RANDOM')
                  .addField(`<:9636_Cross:780079345178902608> Command Locked`, `\`/lyrics\` has been disabled temporarily.`)
                  .setFooter('Bunch', 'https://media.discordapp.net/attachments/781434598617120778/782262504617148486/PicsArt_11-28-11.01.00.png?width=669&height=667'));

                
              }
            })

            client.on('message', msg => {
                  if (msg.content.toLowerCase() === '/snake') {
                      snakeGame.newGame(msg);
                  }
                  else if (msg.content.toLowerCase() === '/hangman') {
                      hangman.newGame(msg);
                  }
                  else if (msg.content.toLowerCase() === '/connect4') {
                      connect4.newGame(msg);
                  }
                  else if (msg.content.toLowerCase() === '/chess') {
                      chess.newGame(msg);
              }
            })

            client.on('message', async message => {
              const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const prefixRegex = new RegExp(`^(<@!?${client.user.id}>)\\s*`);
              if (!prefixRegex.test(message.content)) return;
                const exampleEmbed = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setAuthor('Bunch Music Bot', 'https://cdn.discordapp.com/emojis/782263094008872981.png?v=1')
  .setDescription('To get started, join a voice channel and `/play` a song! You can use song names, video links, and playlist links. A full list of commands is available [here](https://docs.google.com/document/d/1cRUb67XddISl5qJEl4ag5aOAyMEHNBC9w_3t2LFvXrk/edit?usp=sharing) or by typing the command: `/help` \n\nIf you have any questions or need help with Bunch, [click here](https://discord.gg/WkJGTekDZp) to join our support server!')
	.setThumbnail('https://images-ext-1.discordapp.net/external/GfVIM-trVSpGFjwNnIXwLv-cGieXM6i6euaKElC6DEs/https/media.discordapp.net/attachments/761909300405731379/782307760737353738/20201129-015404-unscreen_1.gif')
	.setImage('https://images-ext-1.discordapp.net/external/zEfK8c0ho_q4PvqHuFLl8QTVuEpattu5yg2RZmVOxUA/https/images-ext-2.discordapp.net/external/onJIE1enNij8oh8MOcP9o7Ds3lN2jKU7pWZsPOxqUHA/https/media.discordapp.net/attachments/601060403941736460/702530987598413864/Tw.gif')
	.setFooter('© 2021 Bunch Co.','https://images-ext-1.discordapp.net/external/beJMZyOk5ipOYZYWXS_88TdmtKMYE9GFWZ1_EvsLIys/https/media.discordapp.net/attachments/781434598617120778/787749668045848636/20201213_174419.gif');

message.channel.send(exampleEmbed);
                
              
            })


            



client.login(token);