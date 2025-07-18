const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiện trợ giúp về các lệnh của bot'),

    execute: async (interaction) => {
        const prefix = process.env.PREFIX || '!';
        const basePath = path.join(__dirname, '..'); 

        const categories = {};

        const categoryDirs = fs.readdirSync(basePath).filter(dir =>
            fs.statSync(path.join(basePath, dir)).isDirectory()
        );

        for (const category of categoryDirs) {
            const categoryPath = path.join(basePath, category);
            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(categoryPath, file);
                const command = require(filePath);

                if (!command.data?.name) continue;

                if (!categories[category]) categories[category] = [];
                categories[category].push(`\`/${command.data.name}\``);
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({ name: 'Danh sách lệnh', iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Dưới đây là danh sách lệnh của bot`);

        for (const [category, commands] of Object.entries(categories)) {
            embed.addFields({
                name: `${category}`,
                value: commands.join(' '),
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
