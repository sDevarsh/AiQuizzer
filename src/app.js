const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  max: process.env.RATE_LIMIT_MAX,
});
app.use(limiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quiz", quizRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
