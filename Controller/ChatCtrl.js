// const { Configuration, OpenAIApi } = require("openai");
// const readlineSync = require("readline-sync");
const dotenv = require("dotenv");
const axios = require("axios");

const translator = require("../Middlewares/translator");
dotenv.config();

const { detectLanguage, translateText } = translator;

const chatCtrl = {
  chat: async (req, res) => {
    try {
      const { question } = req.body;

      const lang = await detectLanguage(question);
      const english_translation = await translateText(question, "en");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: english_translation }],
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await translateText(
        response.data.choices[0].message.content,
        lang
      );
      return res.status(200).json({
        message: "success",
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: 500,
      });
    }
  },
};

module.exports = chatCtrl;
