const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ShopItem = require('../../../model/shopItem');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shopedit')
        .setDescription('✏️ Sửa thông tin vật phẩm trong cửa hàng')
        .addStringOption(opt => opt.setName('id').setDescription('ID vật phẩm').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('Tên mới').setRequired(false))
        .addIntegerOption(opt => opt.setName('price').setDescription('Giá xu mới').setRequired(false))
        .addStringOption(opt => opt.setName('description').setDescription('Mô tả mới').setRequired(false))
        .addStringOption(opt => opt.setName('emoji').setDescription('Emoji mới').setRequired(false))
        .addStringOption(opt => opt.setName('expire').setDescription('Hạn dùng mới (vd: 1h, 10m, 2d)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const id = interaction.options.getString('id');
        const updates = {};

        const name = interaction.options.getString('name');
        const price = interaction.options.getInteger('price');
        const description = interaction.options.getString('description');
        const emoji = interaction.options.getString('emoji');
        const expire = interaction.options.getString('expire');

        if (name) updates.name = name;
        if (price) updates.price = price;
        if (description) updates.description = description;
        if (emoji) updates.emoji = emoji;
        if (expire) {
            const msValue = ms(expire);
            if (!msValue) return interaction.reply({ content: '❌ Hạn dùng không hợp lệ.', ephemeral: true });
            updates.expireAfter = msValue;
        }

        const item = await ShopItem.findByIdAndUpdate(id, updates, { new: true });
        if (!item) {
            return interaction.reply({ content: '❌ Không tìm thấy vật phẩm với ID đã nhập.', ephemeral: true });
        }

        await interaction.reply(`✅ Đã cập nhật vật phẩm **${item.name}** thành công.`);
    }
};
