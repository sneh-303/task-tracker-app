const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateTaskSuggestion = async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) {
            return res.status(400).json({ message: "Input is required" });
        }
        
        console.log(" Gemini API key loaded:", !!process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Convert this task idea into a short, clear title and one-sentence description.
    Return it in JSON format exactly like this:
    { "title": "Title", "description": "Description" }

    Task idea: "${input}"
    `;

        // Generating ai output
    const result = await model.generateContent(prompt);
  const response = await result.response;
    const text = response.text();
      console.log(" Gemini raw output:", text); 
          const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    // Try parsing the AI output safely
    let suggestion;
    try {
      suggestion = JSON.parse(cleanText);
    } catch {
      // fallback in case Gemini adds extra formatting
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      suggestion = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }

    res.json(suggestion);
  } catch (error) {
  console.error("Gemini NLP Error:", error.message);
  if (error.response) {
    console.error("Gemini API response:", error.response.data);
  }
  res.status(500).json({ message: "Failed to generate suggestion", error: error.message });
}

};

module.exports = { generateTaskSuggestion };
