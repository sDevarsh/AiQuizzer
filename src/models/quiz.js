const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    grade: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    questions: [
      {
        id: String,
        question: String,
        options: [String],
        answer: String,
      },
    ],
    submissions: [
      {
        responses: [
          {
            questionId: String,
            userResponse: String,
          },
        ],
        score: Number,
        completedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    originalQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
