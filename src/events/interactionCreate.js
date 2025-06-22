const shopview = require('../commands/slash/cửa hàng/shopView');
module.exports = async (client, interaction) => {
    // Slash command (Chat Input)
    if (interaction.guild.id !== process.env.GUILD_ID) {
        interaction.reply('Bot chỉ hoạt động trong server chính. Vui lòng liên hệ admin để được hỗ trợ.')
        return
    }
    if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) {
            console.warn(`⚠ Không tìm thấy slash command: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`❌ Lỗi khi thực hiện slash command "${interaction.commandName}":`, error);
            const replyPayload = {
                content: "⚠ Có lỗi xảy ra khi xử lý lệnh.",
                flags: 64,
            };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(replyPayload).catch(console.error);
            } else {
                await interaction.reply(replyPayload).catch(console.error);
            }
        }
    }

    // Select Menu cho reaction role
    else if (interaction.isStringSelectMenu() && interaction.customId === 'reaction_roles_select') {
        const member = interaction.member;
        const selectedRoleIds = interaction.values;
        const allRoleIds = interaction.component.options.map(option => option.value);

        const addedRoles = selectedRoleIds.filter(id => !member.roles.cache.has(id));
        const removedRoles = allRoleIds.filter(id => !selectedRoleIds.includes(id) && member.roles.cache.has(id));

        try {
            if (addedRoles.length > 0) await member.roles.add(addedRoles);
            if (removedRoles.length > 0) await member.roles.remove(removedRoles);

            await interaction.reply({
                content: `✅ Đã cập nhật role của bạn.`,
                flags: 64,
            });
        } catch (error) {
            console.error("❌ Lỗi khi xử lý reaction role:", error);
            await interaction.reply({
                content: "⚠ Có lỗi khi cập nhật role.",
                flags: 64,
            });
        }
    }
    // 🔹 Button: phân trang shopview
    else if (interaction.isButton()) {
        const matchCategory = interaction.customId.match(/^shop_category_(main|fishing)_(\d+)$/);
        const matchPage = interaction.customId.match(/^shop_(prev|next)_(main|fishing)_(\d+)$/);

        if (matchCategory || matchPage) {
            const { buildShop } = shopview;

            const category = matchCategory ? matchCategory[1] : matchPage[2];
            let page = matchCategory ? parseInt(matchCategory[2]) : parseInt(matchPage[3]);
            if (matchPage) page = matchPage[1] === 'prev' ? page - 1 : page + 1;

            const { embed, components } = await buildShop(interaction, category, page);
            return await interaction.update({ embeds: [embed], components });
        }
    }

    // 🔹 Modal Submit: xử lý cập nhật vật phẩm
    else if (interaction.isModalSubmit() && interaction.customId.startsWith('shopedit_modal_')) {
        const modalHandler = require('../handlers/shopedit/modalSubmit');
        await modalHandler(interaction);
    }
};
