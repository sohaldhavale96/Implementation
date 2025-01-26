const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_URL = process.env.AZURE_URL;

router.get('/chats', async (req, res) => {
  res.json([]); // Return empty array if no chats should be stored
});


// Handle user messages without saving chats
router.post('/message', async (req, res) => {
  try {
    // console.log(req.body);
    if (!req.body.messages[0].content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const question = req.body.messages[0].content;
    const body = {
      top: 1,
      question: question,
      includeUnstructuredSources: true,
      confidenceScoreThreshold: "0.0099",
      answerSpanRequest: {
        enable: true,
        topAnswersWithSpan: 1,
        confidenceScoreThreshold: "0.0099"
      }
    };
    // console.log(body);
    const headers = {
      "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
      "Content-Type": "application/json"
    };

    const response = await axios.post(AZURE_URL, body, { headers });

    const prompts = response.data?.answers?.[0]?.dialog?.prompts || [];
    const answer = response.data?.answers?.[0]?.answer || "No answer found";

    res.json({ answer, prompts });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
