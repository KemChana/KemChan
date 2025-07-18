const GuildConfig = require('../model/guildConfig');

async function setImageChannel(guildId, channelId) {
    return await GuildConfig.findOneAndUpdate(
        { guildId },
        { imageChannelId: channelId },
        { upsert: true, new: true }
    );
}

async function getImageChannel(guildId) {
    const config = await GuildConfig.findOne({ guildId });
    return config?.imageChannelId || null;
}

module.exports = {
    setImageChannel,
    getImageChannel,
};
