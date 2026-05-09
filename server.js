const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const app = express();

app.use(express.json());

// Initialize Gemini with your secret key from Render's environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const userMessage = req.body.message;

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "I'm having trouble thinking right now. Check the logs!" });
  }
});

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => console.log(`Chatbot live on port ${PORT}`));
