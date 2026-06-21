import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { ScrapeResult } from './scraper';
import { FeedbackContext } from './produck';

export async function analyzeContent(scrapeResult: ScrapeResult, apiKey: string, feedbackContext?: FeedbackContext): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemPromptPath = path.join(__dirname, '../prompts/analyze.md');
  const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

  // We feed Gemini the scraped content and ask it to format it according to the system prompt
  let userContent = "";
  if (feedbackContext) {
    userContent += `FEATURE REQUEST CONTEXT\n\n`;
    userContent += `Title:\n${feedbackContext.title}\n\n`;
    userContent += `Description:\n${feedbackContext.description}\n\n`;
    userContent += `Requirements:\n${feedbackContext.requirements}\n\n`;
    userContent += `WEBSITE CONTENT\n\n`;
  } else {
    userContent += "Here is the website content to analyze:\n\n";
  }
  
  if (scrapeResult.metadata) {
    userContent += `METADATA:\n${JSON.stringify(scrapeResult.metadata, null, 2)}\n\n`;
  }
  if (scrapeResult.markdown) {
    userContent += `MARKDOWN CONTENT:\n${scrapeResult.markdown}\n\n`;
  }
  if (scrapeResult.html) {
    // Truncate HTML if it's too large, but usually Gemini Pro handles large contexts well
    userContent += `RAW HTML (for css/token extraction):\n${scrapeResult.html.substring(0, 50000)}\n\n`;
  }

  console.error(`[Analyzer] Sending content to Gemini for analysis...`);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.1, // Low temperature for deterministic, structured output
    }
  });

  const result = await model.generateContent(userContent);
  const responseText = result.response.text();

  if (!responseText) {
    throw new Error("Failed to get a response from Gemini.");
  }

  return responseText;
}
