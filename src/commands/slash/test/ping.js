const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra độ trễ của bot'),

    async execute(interaction) {
        await interaction.reply({ content: 'Pinging...' });
        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = interaction.client.ws.ping;

        await interaction.editReply(`Pong!\nĐộ trễ tin nhắn: **${latency}ms**\nĐộ trễ API: **${apiLatency}ms**`);
        // await interaction.editReply(`Pong!`)
        return;
    }
};
