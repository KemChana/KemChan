const mongoose = require('mongoose');

const sendHistorySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    content: { type: String, required: true },
    fileName: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

sendHistorySchema.index({ guildId: 1, content: 1, fileName: 1 }, { unique: true });

module.exports = mongoose.model('SendHistory', sendHistorySchema);
