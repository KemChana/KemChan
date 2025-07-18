const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setImageChannel } = require('../../../service/imageChannelService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setimagechannel')
        .setDescription('Đặt kênh để bot gửi ảnh')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Chọn kênh để bot gửi ảnh')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    category: 'admin',

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const channel = interaction.options.getChannel('channel');

        try {
            await setImageChannel(guildId, channel.id);
            return interaction.reply(`Đã đặt kênh gửi ảnh là <#${channel.id}>.`);
        } catch (err) {
            console.error('Lỗi khi đặt image channel:', err);
            return interaction.reply({
                content: 'Có lỗi xảy ra khi lưu kênh.',
                flags: 64,
            });
        }
    }
};
