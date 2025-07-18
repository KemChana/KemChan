const express = require("express");
const router = express.Router();
const Question = require("../model/questionModel");

router.post("/import", async (req, res) => {
    try {
        const questions = req.body; 
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
        }

        await Question.insertMany(questions);
        res.status(201).json({ message: "Thêm dữ liệu thành công!" });
    } catch (error) {
        console.error("Lỗi khi nhập dữ liệu:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
