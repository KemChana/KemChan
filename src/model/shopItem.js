const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    emoji: { type: String },
    expireAfter: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShopItem', shopItemSchema);
