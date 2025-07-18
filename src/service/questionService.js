const Question = require("../model/questionModel");

const QuestionService = {
    async getAllQuestions() {
        return await Question.find({});
    },

    async getRandomQuestion() {
        const count = await Question.countDocuments();
        if (count === 0) return null;

        const randomIndex = Math.floor(Math.random() * count);
        return await Question.findOne().skip(randomIndex);
    },

    async getQuestionById(id) {
        return await Question.findById(id);
    },

    async addQuestion(question, options, correctIndex) {
        if (options.length !== 4 || correctIndex < 0 || correctIndex > 3) {
            throw new Error("Câu hỏi phải có 4 đáp án và vị trí đúng từ 0-3.");
        }

        const newQuestion = new Question({ question, options, correctIndex });
        return await newQuestion.save();
    },

    async updateQuestion(id, updatedData) {
        return await Question.findByIdAndUpdate(id, updatedData, { new: true });
    },

    async deleteQuestion(id) {
        return await Question.findByIdAndDelete(id);
    }
};

module.exports = QuestionService;
