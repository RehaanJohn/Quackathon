const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  console.log("Fetching models...");
  try {
    // The SDK does not expose listModels directly easily on the default client in all versions,
    // but we can just use fetch to hit the REST API directly.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    console.log("Available models for generateContent:");
    generateModels.forEach(m => console.log(m.name));
  } catch (e) {
    console.error("Error fetching models:", e);
  }
}

listModels();
