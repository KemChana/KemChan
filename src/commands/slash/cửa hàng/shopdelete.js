const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ShopItem = require('../../../model/shopItem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shopdelete')
        .setDescription('Xóa vật phẩm khỏi cửa hàng')
        .addStringOption(opt => opt.setName('id').setDescription('ID vật phẩm cần xóa').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const id = interaction.options.getString('id');
        const item = await ShopItem.findByIdAndDelete(id);

        if (!item) {
            return interaction.reply({ content: 'Không tìm thấy vật phẩm với ID đã nhập.', ephemeral: true });
        }

        await interaction.reply(`Đã xóa vật phẩm **${item.name}** khỏi cửa hàng.`);
    }
};
