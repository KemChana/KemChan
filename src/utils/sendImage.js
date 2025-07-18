const GuildConfig = require('../model/guildConfig');
const SentImage = require('../model/sentImageModel');
const SendHistory = require('../model/sendHistoryModel');
const { EmbedBuilder } = require('discord.js');

const processingLocks = new Set();

async function sendImageByConfig(message) {
    const guildId = message.guild.id;
    const content = message.content.trim().toLowerCase();
    const lockKey = `${guildId}:${content}`;

    if (processingLocks.has(lockKey)) return;
    processingLocks.add(lockKey);

    try {
        const config = await GuildConfig.findOne({ guildId });
        if (!config || message.channel.id !== config.imageChannelId) return;

        const allImages = await SentImage.find({ content });
        if (allImages.length === 0) {
            return await message.reply('Không có ảnh nào trong nội dung này.');
        }

        const history = await SendHistory.find({ guildId, content });
        const sentFileNames = history.map(doc => doc.fileName);

        let remaining = allImages.filter(img => !sentFileNames.includes(img.fileName));

        if (remaining.length === 0) {
            await SendHistory.deleteMany({ guildId, content });
            remaining = allImages;
        }

        const randomImage = remaining[Math.floor(Math.random() * remaining.length)];

        const embed = new EmbedBuilder()
            .setImage(randomImage.url)
            .setColor('Random');

        await message.channel.send({ files: [randomImage.url] });

        await SendHistory.create({
            guildId,
            content,
            fileName: randomImage.fileName,
        });

    } catch (err) {
        console.error('Lỗi khi gửi ảnh:', err);
        await message.reply('Có lỗi xảy ra khi gửi ảnh.');
    } finally {
        processingLocks.delete(lockKey);
    }
}

module.exports = sendImageByConfig;
