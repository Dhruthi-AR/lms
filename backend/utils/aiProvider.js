const { OpenAI } = require('openai');
const { HfInference } = require('@huggingface/inference');

// Initialize providers based on available environment variables
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1" // Allows for Kimi/custom endpoints
  });
}

let hf;
if (process.env.HF_ACCESS_TOKEN) {
  hf = new HfInference(process.env.HF_ACCESS_TOKEN);
}

const generateText = async (prompt, systemPrompt = "You are a helpful AI tutor.") => {
  const safePrompt = prompt || "Hello";
  
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: safePrompt }
        ],
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch(err) {
      console.error("OpenAI failed", err.message);
    }
  } 
  
  if (hf) {
    try {
      const response = await hf.chatCompletion({
        model: process.env.HF_MODEL || "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: safePrompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      return response.choices[0].message.content;
    } catch(err) {
      console.error("HF failed", err.message);
    }
  }
  
  // Fallback Mock Response for development if no keys are provided yet or if API is down
  if (safePrompt.toLowerCase().includes("quiz") || safePrompt.toLowerCase().includes("multiple choice")) {
      return JSON.stringify([
          {
            "question": "What is the primary purpose of React?",
            "options": ["Building databases", "Building User Interfaces", "Styling websites", "Server-side routing"],
            "correctAnswer": "Building User Interfaces"
          },
          {
            "question": "Which hook is used for side effects in React components?",
            "options": ["useState", "useEffect", "useMemo", "useContext"],
            "correctAnswer": "useEffect"
          },
          {
            "question": "What does JSX stand for?",
            "options": ["JavaScript XML", "Java Syntax Extension", "JSON X", "JavaScript Extension"],
            "correctAnswer": "JavaScript XML"
          }
      ]);
  }
  
  return "I'm currently running in offline demo mode. I received your message: '" + safePrompt + "'. Your AI credentials might be expired, missing, or the server is unreachable. Please verify your HF_ACCESS_TOKEN or OPENAI_API_KEY in the backend .env file!";
};

module.exports = { generateText };
