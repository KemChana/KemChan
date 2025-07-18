const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    name: String,
    plantedAt: Date,
    harvestTime: Number,
    isHarvested: { type: Boolean, default: false },
    isDamaged: { type: Boolean, default: false },
    fertilizerUsed: { type: Boolean, default: false },
    isAlert: { type: Boolean, default: false },
});

const farmSchema = new mongoose.Schema({
    userId: String,
    landSlots: { type: Number, default: 9 }, 
    crops: [cropSchema], 
});

module.exports = mongoose.model("Farm", farmSchema);
