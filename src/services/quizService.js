const Quiz = require("../models/quiz");
const cacheService = require("./cacheService");

exports.getQuizHistory = async (filters, user) => {
  try {
    let query = {};

    query.userId = user._id.toString();
    if (filters.grade) query.grade = filters.grade;
    if (filters.subject) query.subject = filters.subject;

    if (filters.from || filters.to) {
      query["submissions.completedDate"] = {};
      if (filters.from)
        query["submissions.completedDate"].$gte = new Date(filters.from);
      if (filters.to)
        query["submissions.completedDate"].$lte = new Date(filters.to);
    }

    if (filters.minScore) {
      query["submissions.score"] = { $gte: filters.minScore };
    }
    if (filters.maxScore) {
      if (query["submissions.score"]) {
        query["submissions.score"].$lte = filters.maxScore;
      } else {
        query["submissions.score"] = { $lte: filters.maxScore };
      }
    }
    const quizzes = await Quiz.find(query)
      .sort({ "submissions.completedDate": -1 })
      .limit(filters.limit ? parseInt(filters.limit) : 50);

    if (filters.minScore) {
      for (let i = 0; i < quizzes.length; i++) {
        quizzes[i].submissions = quizzes[i].submissions.filter(
          (x) => x.score >= filters.minScore
        );
      }
    }
    if (filters.maxScore) {
      for (let i = 0; i < quizzes.length; i++) {
        quizzes[i].submissions = quizzes[i].submissions.filter(
          (x) => x.score <= filters.maxScore
        );
      }
    }
    if (filters.from || filters.to) {
      if (filters.from) {
        for (let i = 0; i < quizzes.length; i++) {
          quizzes[i].submissions = quizzes[i].submissions.filter(
            (x) => x.completedDate >= new Date(filters.from)
          );
        }
      }
      if (filters.to) {
        for (let i = 0; i < quizzes.length; i++) {
          quizzes[i].submissions = quizzes[i].submissions.filter(
            (x) => x.completedDate <= new Date(filters.to)
          );
        }
      }
    }

    return quizzes;
  } catch (error) {
    console.error("Error in getQuizHistory:", error);
    throw new Error("Failed to retrieve quiz history");
  }
};

exports.retryQuiz = async (quizId) => {
  try {
    const originalQuiz = await Quiz.findById(quizId);

    return originalQuiz;
  } catch (error) {
    console.error("Error in retryQuiz:", error);
    throw new Error("Failed to create retry quiz");
  }
};

exports.getQuizById = async (quizId) => {
  try {
    let quiz = await cacheService.getQuiz(quizId);
    if (!quiz) {
      quiz = await Quiz.findById(quizId);
      if (quiz) {
        await cacheService.setQuiz(quizId, quiz);
      }
    }
    return quiz;
  } catch (error) {
    console.error("Error in getQuizById:", error);
    throw new Error("Failed to retrieve quiz");
  }
};
