"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeContent = analyzeContent;
const generative_ai_1 = require("@google/generative-ai");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function analyzeContent(scrapeResult, apiKey, feedbackContext) {
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const systemPromptPath = path.join(__dirname, '../prompts/analyze.md');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');
    // We feed Gemini the scraped content and ask it to format it according to the system prompt
    const generatedDate = new Date().toISOString().split("T")[0];
    let userContent = `Generation Date:\n${generatedDate}\n\n`;
    if (feedbackContext) {
        userContent += `FEATURE REQUEST CONTEXT\n\n`;
        userContent += `Title:\n${feedbackContext.title}\n\n`;
        userContent += `Description:\n${feedbackContext.description}\n\n`;
        userContent += `Requirements:\n${feedbackContext.requirements}\n\n`;
        userContent += `WEBSITE CONTENT\n\n`;
    }
    else {
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
    const REQUIRED_HEADINGS = [
        "## Brand Identity",
        "## Color Palette",
        "## Typography",
        "## Spacing & Layout",
        "## Component Inventory",
        "## Interaction Patterns",
        "## Page Structure"
    ];
    let attempt = 0;
    let responseText = "";
    while (attempt < 2) {
        const result = await model.generateContent(userContent);
        responseText = result.response.text();
        if (!responseText) {
            throw new Error("Failed to get a response from Gemini.");
        }
        const missingHeadings = REQUIRED_HEADINGS.filter(h => !responseText.includes(h));
        if (missingHeadings.length === 0) {
            break; // Validation passed
        }
        attempt++;
        console.error(`[Analyzer] Attempt ${attempt} failed. Missing headings: ${missingHeadings.join(", ")}`);
        if (attempt === 2) {
            console.error("[Analyzer] Reached max retries. Rebuilding document deterministically.");
            const parts = responseText.split(/(^## [^\n]+)/m);
            const preamble = parts[0].trim();
            const sectionMap = new Map();
            for (let i = 1; i < parts.length; i += 2) {
                const heading = parts[i].trim();
                const content = parts[i + 1] ? parts[i + 1].trim() : "";
                sectionMap.set(heading, content);
            }
            let rebuilt = preamble ? preamble + "\n\n" : "";
            for (const heading of REQUIRED_HEADINGS) {
                const content = sectionMap.get(heading);
                if (content && content.length > 0) {
                    rebuilt += `${heading}\n${content}\n\n`;
                }
                else {
                    rebuilt += `${heading}\nNot detected.\n\n`;
                }
            }
            responseText = rebuilt.trim();
        }
        else {
            console.error("[Analyzer] Retrying Gemini generation...");
        }
    }
    return responseText;
}
