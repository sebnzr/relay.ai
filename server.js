const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const useSearch = req.body.useSearch;

    // If the user checked the box, give Gemini the Google Search tool
    const tools = useSearch ? [{ googleSearch: {} }] : undefined;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: tools
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("DETAILED ERROR:", error);
    res.status(500).json({ reply: "Server error. Check Render logs." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay AI live on ${PORT}`));
