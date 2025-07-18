require("dotenv").config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    prefix: process.env.PREFIX,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    }
};
