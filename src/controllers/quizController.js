const Quiz = require("../models/quiz");
const aiService = require("../services/aiService");
const quizService = require("../services/quizService");
const cacheService = require("../services/cacheService");
const emailService = require("../services/emailService");

exports.generateQuiz = async (req, res) => {
  try {
    const { grade, subject, totalQuestions, maxScore, difficulty } = req.body;
    if (
      difficulty.toUpperCase() == "EASY" ||
      difficulty.toUpperCase() == "MEDIUM" ||
      difficulty.toUpperCase() == "HARD"
    ) {
      const userId = req.user._id.toString();
      const quiz = await aiService.generateQuiz(
        grade,
        subject,
        totalQuestions,
        maxScore,
        difficulty,
        userId
      );
      const data = await Quiz.create(quiz);

      await cacheService.setQuiz(data._id, data);
      return res.json(data);
    } else {
      res
        .status(500)
        .json({ message: "Difficulty should be EASY,MEDIUM,HARD only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error generating quiz", error: error });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, responses } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const maxScore = quiz.maxScore;
    for (let i = 0; i < responses.length; i++) {
      const userResponse = responses[i].userResponse;
      const questionId = responses[i].questionId;

      const question = quiz.questions.find(
        (q) => q._id.toString() === questionId
      );

      if (question) {
        if (userResponse.toUpperCase() === question.answer.toUpperCase()) {
          correctAnswers++;
        }
      }
    }
    const score = (correctAnswers / totalQuestions) * maxScore;
    quiz.submissions.push({ responses, score });
    await quiz.save();

    emailService.sendQuizResults(req.user.email, quiz, score);

    res.json({ score });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error: error });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const filters = req.query;
    const quizzes = await quizService.getQuizHistory(filters, req.user);
    res.json(quizzes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving quiz history", error: error });
  }
};

exports.retryQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const cacheQuiz = await cacheService.getQuiz(quizId);
    if (cacheQuiz) {
      cacheQuiz.questions = cacheQuiz.questions.map((x) => {
        return {
          question: x.question,
          options: x.options,
          __id: x._id,
        };
      });
      console.log("This Data is cached data");
      return res.json(cacheQuiz);
    }

    const quiz = await quizService.retryQuiz(quizId);

    quiz.questions = await quiz.questions.map((x) => {
      return {
        question: x.question,
        options: x.options,
        __id: x._id,
      };
    });

    const newObj = {
      grade: quiz.grade,
      subject: quiz.subject,
      totalQuestions: quiz.totalQuestions,
      maxScore: quiz.maxScore,
      difficulty: quiz.difficulty,
      questions: quiz.questions,
      _id: quiz._id,
      userId: quiz.userId,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
    cacheService.setQuiz(newObj._id, newObj);
    res.json(newObj);
  } catch (error) {
    res.status(500).json({ message: "Error retrying quiz", error: error });
  }
};

exports.getHint = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);
    const hint = await aiService.getHint(quiz, questionId);
    res.json({ hint });
  } catch (error) {
    res.status(500).json({ message: "Error getting hint", error: error });
  }
};
exports.getSubmission = async (req, res) => {
  try {
    const { quizId } = req.params;
    const submittedQuiz = await Quiz.findById(quizId);
    return res.json(submittedQuiz.submissions);
  } catch (error) {
    res.status(500).json({ message: "Error retrying quiz", error: error });
  }
};
