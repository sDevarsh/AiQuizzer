const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;

exports.generateQuiz = async (
  grade,
  subject,
  totalQuestions,
  maxScore,
  difficulty,
  userId
) => {
  const prompt = `Generate a ${subject} quiz for grade ${grade} with ${totalQuestions} questions in JSON format. Each question should have the following structure as given below give array of such questions: 
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": "answer in form of A,B,C,D"
  }
  Ensure difficulty level is ${difficulty}`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.choices[0].message.content);
    const quizContent = await JSON.parse(
      response.data.choices[0].message.content
    );
    return {
      grade,
      subject,
      totalQuestions,
      maxScore,
      difficulty,
      questions: quizContent,
      userId,
    };
  } catch (error) {
    console.error("Failed to parse quiz content:", error);
    throw new Error("Error parsing quiz content");
  }
};

exports.getHint = async (quiz, questionId) => {
  const question = quiz.questions.find((q) => q._id.toString() === questionId);
  const prompt = `Provide a hint for the following quiz question. 
  Quiz ${question}. Provide it in plain text.`;

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};

exports.generateSuggestions = async (quiz, score) => {
  const prompt = `Based on the quiz results (score: ${score}/${quiz.maxScore}) for a ${quiz.subject} quiz at grade ${quiz.grade} level, provide two suggestions to improve skills. Return suggestions in a JSON array format with a "suggestions" key.`;

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  try {
    const suggestions = response.data.choices[0].message.content;

    return JSON.parse(suggestions).suggestions;
  } catch (error) {
    console.error("Failed to parse suggestions:", error);
    return ["Try To Get Better", "Study this topic more.."];
  }
};
