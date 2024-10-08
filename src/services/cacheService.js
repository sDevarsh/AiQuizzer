const Redis = require("ioredis");
require("dotenv").config();
const client = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

exports.getQuiz = async (quizId) => {
  try {
    const cachedQuiz = await client.get(`quiz:${quizId}`);
    if (cachedQuiz) {
      return JSON.parse(cachedQuiz);
    }
    return null;
  } catch (err) {
    console.error(`Error getting quiz ${quizId} from cache:`, err);
  }
};
exports.setQuiz = async (quizId, quiz) => {
  try {
    await client.set(`quiz:${quizId}`, JSON.stringify(quiz));
  } catch (err) {
    console.error(`Error setting quiz ${quizId} to cache:`, err);
  }
};
exports.clearCache = async (quizId) => {
  try {
    await client.del(`quiz:${quizId}`);
  } catch (err) {
    console.error(`Error clearing cache for quiz ${quizId}:`, err);
  }
};
