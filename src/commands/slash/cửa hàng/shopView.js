const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ShopItem = require('../../../model/shopItem');

function formatExpire(ms) {
    if (!ms) return 'Vĩnh viễn';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} giây`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ`;
    const days = Math.floor(hours / 24);
    return `${days} ngày`;
}

async function buildShop(interaction, category = 'main', page = 0) {
    const limit = 5;
    const items = await ShopItem.find({ category }).sort({ createdAt: -1 });
    const totalPages = Math.ceil(items.length / limit);
    const sliced = items.slice(page * limit, page * limit + limit);

    const embed = new EmbedBuilder()
        .setThumbnail(interaction.client.user.displayAvatarURL({ extension: 'png', size: 512 }))
        .setTitle(`** Kem's Shop**`)
        .setColor(category === 'main' ? '#FFA500' : '#00BFFF')
        .setDescription(
            sliced.length === 0
                ? 'Không có vật phẩm nào trong mục này.'
                : sliced.map((item, i) =>
                    `**${page * limit + i + 1}. ${item.emoji || ''} - ${item.name}**` +
                    `${item.description || '_Không có mô tả_'}\n` +
                    `> Giá: **${item.price} xu**\n` +
                    `> HSD: ${formatExpire(item.expireAfter)}\n` +
                    `> ID: \`${item._id}\``).join('\n\n')
        )
        .setFooter({ text: `Trang ${page + 1} / ${Math.max(totalPages, 1)}` });

    const paginationRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`shop_prev_${category}_${page}`)
            .setLabel('⬅')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page <= 0),
        new ButtonBuilder()
            .setCustomId(`shop_next_${category}_${page}`)
            .setLabel('➡')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page >= totalPages - 1)
    );

    const categoryRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`shop_category_main_${page}`)
            .setLabel('Shop Chính')
            .setStyle(category === 'main' ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`shop_category_fishing_${page}`)
            .setLabel('Shop Câu Cá')
            .setStyle(category === 'fishing' ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );

    return { embed, components: [paginationRow, categoryRow] };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shopview')
        .setDescription('Xem cửa hàng vật phẩm'),

    async execute(interaction) {
        const { embed, components } = await buildShop(interaction);
        await interaction.reply({ embeds: [embed], components });
    },

    buildShop 
};
