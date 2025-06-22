const mongoose = require('mongoose');

// Tạo schema cho người dùng
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    money: { type: Number, default: 1000 },
    gameInProgress: { type: Boolean, default: false },
    lastWorked: { type: Number, default: 0 }, // Thời gian cuối cùng nhận tiền từ work
    lastRob: { type: Number, default: 0 }, // Thời gian cuối cùng nhận tiền từ rob
    lastCrime: { type: Number, default: 0 }, // Thời gian cuối cùng nhận tiền từ rob
    lastMine: { type: Number, default: 0 },
    storage: {
        type: Map,
        of: Number, // Key: tên nông sản, Value: số lượng
        default: {}
    },
    inventory: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
            quantity: { type: Number, default: 1 },
            acquiredAt: { type: Date, default: Date.now },
            durability: { type: Number },    
            expiresAt: { type: Date },       
            customName: { type: String }     
        }
    ]
});

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;