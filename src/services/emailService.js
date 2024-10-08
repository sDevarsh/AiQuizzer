const nodemailer = require("nodemailer");
const aiService = require("./aiService");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendQuizResults = async (email, quiz, score) => {
  try {
    const suggestions = await aiService.generateSuggestions(quiz, score);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Your Quiz Results",
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: auto;
    }
    h1 {
      color: #4CAF50;
      font-size: 24px;
      text-align: center;
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin: 10px 0;
    }
    .score {
      font-size: 18px;
      font-weight: bold;
      color: #f39c12;
    }
    h2 {
      font-size: 20px;
      color: #e74c3c;
      margin-top: 20px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      background-color: #e7f3fe;
      border: 1px solid #b3d9ff;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Quiz Results</h1>
    <p><strong>Subject:</strong> ${quiz.subject}</p>
    <p><strong>Grade Level:</strong> ${quiz.grade}</p>
    <p><strong>Difficulty:</strong> ${quiz.difficulty}</p>
    <p class="score"><strong>Score:</strong> ${score}/${quiz.maxScore}</p>
    
    <h2>Suggestions to improve:</h2>
    <ul>
      <li>${suggestions[0]}</li>
      <li>${suggestions[1]}</li>
    </ul>
  </div>
</body>
</html>

    `,
    };

    await transporter.sendMail(mailOptions);
  } catch (e) {
    throw new Error();
  }
};
