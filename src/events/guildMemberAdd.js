const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const GuildConfig = require('../model/guildConfig');
const path = require('path');
const fs = require('fs');

function parsePlaceholders(text, member) {
    return text
        .replace(/<@user>/g, `${member.user.globalName || member.user.username}`);
}

module.exports = async (client, member) => {
    console.log("Thành viên mới:", member.user.tag);
    // return;
    const config = await GuildConfig.findOne({ guildId: member.guild.id });
    if (!config || !config.welcomeChannelId || !config.welcomeEmbed) {
        console.log("Thiếu config chào mừng hoặc channel");
        return;
    }

    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) {
        console.log("Không tìm thấy kênh welcome:", config.welcomeChannelId);
        return;
    }

    const { title, description, image, footer, color } = config.welcomeEmbed;
    const parsedTitle = parsePlaceholders(title || '', member);
    const parsedDescription = parsePlaceholders(description || '', member);
    const parsedFooter = parsePlaceholders(footer || '', member);

    const embed = new EmbedBuilder()
        .setTitle(parsedTitle)
        .setDescription(parsedDescription)
        .setAuthor({
            name: member.user.globalName || member.user.username,
            iconURL: member.user.displayAvatarURL()
        });

    try {
        embed.setColor(color || '#FFC0CB');
    } catch {
        embed.setColor('#FFC0CB');
    }

    if (footer) embed.setFooter({ text: parsedFooter });

    const files = [];

    // if (image) {
    //     const filePath = path.join(__dirname, '../assets/welcome', image);
    //     if (fs.existsSync(filePath)) {
    //         embed.setImage(`attachment://${image}`);
    //         files.push(new AttachmentBuilder(filePath, { name: image }));
    //     } else {
    //         console.warn('File ảnh không tồn tại:', filePath);
    //     }
    // }

    if (image) {
        embed.setImage(image);
    }


    channel.send({ content: `Hé lu người đẹp <@${member.user.id}>`, embeds: [embed], files }).catch(console.error);

    const logChannelId = '1379479672341008424';
    const logChannel = member.guild.channels.cache.get(logChannelId);

    const embed2 = new EmbedBuilder()
        .setColor('#FFC0CB')
        .setDescription(`Người đẹp đừng quên ghé tại <#1224257121583894560> để xem lời nhắn của tui nhen <3`)
        .setImage('https://media.discordapp.net/attachments/1224256733212315648/1376831492319088690/231ea7a60af054bab9f2e4e1ebee24b1.gif?ex=685a5a40&is=685908c0&hm=674efd3672dc54686279b13692db3465bd1b7bab0c7d1dea992edd5b74e530b4&');

    // if (logChannel) {
    //     logChannel.send({
    //         content: `Hé lu người đẹp <@${member.user.id}> nhennn!!\n<@&1375713771586191464> đâu ra chào người đẹp nhanh lên`,
    //         embeds: [embed2]
    //     }).catch(console.error);
    // }

};
