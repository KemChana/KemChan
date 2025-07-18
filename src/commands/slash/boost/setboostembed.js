const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../../model/guildConfig');
const { v2: cloudinary } = require('cloudinary');
const fetch = require('node-fetch');
const config = require('../../../config/config');

cloudinary.config(config.cloudinary);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('setboostembed')
        .setDescription('Thiết lập nội dung embed khi người dùng boost server')
        .addStringOption(opt => opt.setName('title').setDescription('Tiêu đề').setRequired(true))
        .addStringOption(opt => opt.setName('color').setDescription('Màu (hex hoặc tên màu)').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Nội dung (\\n = xuống dòng)').setRequired(true))
        .addStringOption(opt => opt.setName('footer').setDescription('Chân trang (\\n = xuống dòng)').setRequired(false))
        .addAttachmentOption(opt => opt.setName('image').setDescription('Ảnh/gif chào mừng').setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const guildId = interaction.guild.id;
        const title = interaction.options.getString('title');
        const color = interaction.options.getString('color');
        const description = interaction.options.getString('description').replace(/\\n/g, '\n');
        const footer = interaction.options.getString('footer')?.replace(/\\n/g, '\n') || null;
        const image = interaction.options.getAttachment('image');

        let imageUrl = null;

        let dbConfig = await GuildConfig.findOne({ guildId }) || new GuildConfig({ guildId });

        if (image) {
            if (dbConfig.boostEmbed?.image) {
                const oldUrl = dbConfig.boostEmbed.image;
                const matches = oldUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)/);
                if (matches && matches[1]) {
                    const publicId = matches[1];
                    try {
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                    } catch (e) {
                        console.warn('Không thể xóa ảnh cũ:', e.message);
                    }
                }
            }

            const response = await fetch(image.url);
            const buffer = await response.buffer();

            const uploadResult = await new Promise((resolve, reject) => {
                const { Readable } = require('stream');
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'discord/boost',
                    public_id: `boost_${guildId}`,
                    resource_type: 'image',
                    overwrite: true
                }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });

                Readable.from(buffer).pipe(uploadStream);
            });

            imageUrl = uploadResult.secure_url;
        }

        dbConfig.boostEmbed = {
            title,
            description,
            image: imageUrl || dbConfig.boostEmbed?.image || null,
            footer,
            color
        };

        await dbConfig.save();

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (footer) embed.setFooter({ text: footer });
        if (dbConfig.boostEmbed.image) embed.setImage(dbConfig.boostEmbed.image);

        await interaction.editReply({
            content: 'Đã lưu embed chào mừng. Đây là bản preview:',
            embeds: [embed]
        });
    }
};
