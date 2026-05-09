const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const app = express();

app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    // This is the most stable string for the Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const userMessage = req.body.message;

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("DETAILED ERROR:", error);
    res.status(500).json({ reply: "Server error. Check Render logs for the full trace." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay AI live on ${PORT}`));
