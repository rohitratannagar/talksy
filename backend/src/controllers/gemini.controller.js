// controllers/gemini.controller.js
import { GoogleGenAI } from "@google/genai";
import { config as configDotenv } from "dotenv";
import removeMarkdown from 'remove-markdown';
configDotenv();


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const generateText = async (req, res) => {
  try {
    console.log(req.body);
    const contents = req.body.text;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });
    const result = removeMarkdown(response.candidates[0].content.parts[0].text);
    res.json({ reply:  result});
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ message: "Gemini failed", error: error.message });
  }
};

export { generateText };
