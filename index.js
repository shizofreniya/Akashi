const { Client } = require('discord.js'),
    { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus} = require('@discordjs/voice')
    fs = require('fs'),
    { join } = require('path');

require('dotenv').config();

const client = new Client({ 
    intents: ['GUILDS', 'GUILD_VOICE_STATES'], 
    ws: {
        properties: {
            $browser: 'Discord iOS'
        }
    }
});

client.login(process.env.TOKEN);

client.on('ready', () => console.log('Бот запущен.'));

client.on('voiceStateUpdate', async (old, state) => {
    if (old.channel || state.channel?.members.has(client.user.id) || state.member.user.bot) return;
    if (Math.floor(Math.random() * (10 - 1 + 1) + 1) < 7) return;
    
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    await sleep(1000);

    const connection = joinVoiceChannel({
        channelId: state.channel.id,
        guildId: state.channel.guild.id,
        adapterCreator: state.channel.guild.voiceAdapterCreator
    });


    const tracks = fs.readdirSync(join(__dirname, 'tracks'));
    const resource = createAudioResource(`./tracks/${tracks[Math.floor(Math.random() * (tracks.length + 1))]}`);

    const player = createAudioPlayer();

    player.on(AudioPlayerStatus.Idle, async () => {
        await sleep(1000);
        player.stop();
        connection.destroy();
    });

    connection.subscribe(player);
    player.play(resource);
});