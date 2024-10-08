const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/generate", quizController.generateQuiz);
router.post("/submit", quizController.submitQuiz);
router.get("/history", quizController.getQuizHistory);
router.post("/:quizId/retry", quizController.retryQuiz);
router.get("/:quizId/question/:questionId/hint", quizController.getHint);

router.get("/:quizId/getSubmissionOfQuiz", quizController.getSubmission);
module.exports = router;
