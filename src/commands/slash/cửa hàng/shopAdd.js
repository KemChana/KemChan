const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ShopItem = require('../../../model/shopItem');

function parseDuration(input) {
    const match = /^(\d+)([smhd])$/.exec(input);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const unitToMs = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return value * unitToMs[unit];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shopadd')
        .setDescription('🛒 Thêm vật phẩm vào cửa hàng')
        .addStringOption(opt => opt.setName('name').setDescription('Tên vật phẩm').setRequired(true))
        .addIntegerOption(opt => opt.setName('price').setDescription('Giá xu').setRequired(true))
        .addStringOption(opt => opt.setName('category').setDescription('Giá xu').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Mô tả vật phẩm').setRequired(false))
        .addStringOption(opt => opt.setName('exprieat').setDescription('Hạn sử dụng (vd: 10s, 5m, 1h, 1d)').setRequired(false))
        .addStringOption(opt => opt.setName('emoji').setDescription('Biểu tượng emoji (tuỳ chọn)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description') || '';
        const price = interaction.options.getInteger('price');
        const emoji = interaction.options.getString('emoji') || '';
        const expireInput = interaction.options.getString('exprieat');
        const category = interaction.options.getString('category');
        let expireAfter = null;
        if (expireInput) {
            expireAfter = parseDuration(expireInput);
            if (!expireAfter) {
                return interaction.reply({
                    content: '❌ Định dạng hạn sử dụng không hợp lệ. Hãy dùng dạng như: `10s`, `5m`, `2h`, `1d`.',
                    ephemeral: true
                });
            }
        }

        const item = new ShopItem({
            name,
            description,
            price,
            emoji,
            expireAfter,
            category,
        });

        await item.save();

        await interaction.reply(`✅ Đã thêm vật phẩm \`${name}\` vào cửa hàng với giá **${price} xu**${expireAfter ? ` và hạn sử dụng **${expireInput}**` : ''}.`);
    }
};
