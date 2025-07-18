const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const SentImage = require('../model/sentImageModel');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');
    // await SentImage.deleteMany({});
    // console.log('Đã xóa toàn bộ dữ liệu cũ trong SentImage');
    uploadImages();
}).catch(err => console.error('MongoDB error:', err));

const uploadImages = async () => {
    const baseDir = path.join(__dirname, '../assets/images');
    const guildId = 1050761764490453082;

    const folders = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name); 

    for (const folderName of folders) {
        const folderPath = path.join(baseDir, folderName);
        const files = fs.readdirSync(folderPath)
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        for (const fileName of files) {
            const filePath = path.join(folderPath, fileName);

            try {
                const uploadRes = await cloudinary.uploader.upload(filePath, {
                    folder: `discord_images/${folderName}`,
                    public_id: fileName.replace(/\.[^/.]+$/, ''),
                });

                await SentImage.updateOne(
                    { guildId, content: folderName, fileName },
                    {
                        guildId,
                        content: folderName,
                        fileName,
                        url: uploadRes.secure_url,
                        sentAt: new Date(),
                    },
                    { upsert: true }
                );

                console.log(`Uploaded ${folderName}/${fileName}`);
            } catch (err) {
                console.error(`Failed ${folderName}/${fileName}:`, err.message);
            }
        }
    }

    console.log('Upload complete!');
    mongoose.disconnect();
};
