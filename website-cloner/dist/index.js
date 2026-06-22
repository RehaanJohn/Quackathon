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
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const scraper_1 = require("./scraper");
const analyzer_1 = require("./analyzer");
const validator_1 = require("./validator");
const parcel_1 = require("./parcel");
async function handleBlockedScrapeError(error, requestedUrl) {
    try {
        await (0, parcel_1.saveBlockedAttempt)({
            url: requestedUrl,
            reason: error.reason,
            detectedIssue: error.detectedIssue,
            requestedUrl: requestedUrl,
            finalUrl: error.finalUrl || requestedUrl
        });
    }
    catch (err) {
        console.warn("[Parcel] Failed to save blocked attempt:", err);
    }
    const jsonResponse = JSON.stringify({
        success: false,
        blocked: true,
        reason: error.message,
        detectedIssue: error.detectedIssue,
        requestedUrl: requestedUrl,
        finalUrl: error.finalUrl || requestedUrl
    }, null, 2);
    const userFacing = `❌ Unable to generate design blueprint.

Reason:
The target website redirected to an authentication, verification, or protected page.

Detected Issue: ${error.detectedIssue}

Requested URL: ${requestedUrl}

Final URL: ${error.finalUrl || requestedUrl}

Suggestions:
* Use a publicly accessible website.
* Use a landing page instead of a dashboard.
* Avoid authenticated URLs.
* Verify the page can be viewed without logging in.

This blocked attempt has been recorded for debugging and future analysis.`;
    return {
        content: [{ type: "text", text: `${jsonResponse}\n\n${userFacing}` }],
        isError: true
    };
}
// Load environment variables from .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const firecrawlKey = process.env.FIRECRAWL_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
if (!firecrawlKey || !geminiKey) {
    console.error("Missing FIRECRAWL_API_KEY or GEMINI_API_KEY in environment");
    process.exit(1);
}
const server = new index_js_1.Server({
    name: "website-cloner-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "clone_website",
                description: "Scrape a website using Firecrawl, analyze it with Gemini, and generate a structured design.md specification.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The URL of the website to clone/analyze.",
                        },
                        includePrompt: {
                            type: "boolean",
                            description: "Whether to include a 'Recreate Prompt' at the end of the specification.",
                            default: false
                        }
                    },
                    required: ["url"],
                },
            },
            {
                name: "clone_website_from_feedback",
                description: "Fetch Produck feedback, scrape a website, and generate a design spec influenced by the feedback.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The URL of the website to clone/analyze.",
                        },
                        feedbackContext: {
                            type: "object",
                            description: "The Produck feedback context object.",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                requirements: { type: "string" }
                            },
                            required: ["title", "description", "requirements"]
                        },
                        includePrompt: {
                            type: "boolean",
                            description: "Whether to include a 'Recreate Prompt' at the end of the specification.",
                            default: false
                        }
                    },
                    required: ["url", "feedbackContext"],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    if (request.params.name === "clone_website") {
        const { url, includePrompt = false } = request.params.arguments;
        try {
            console.error(`[MCP] Starting clone_website for ${url}...`);
            // 1. Scrape
            const scrapedData = await (0, scraper_1.scrapeUrl)(url, firecrawlKey);
            // Validation
            (0, validator_1.validateScrapeResult)(scrapedData);
            // 2. Analyze
            const analysisMarkdown = await (0, analyzer_1.analyzeContent)(scrapedData, geminiKey);
            // 3. Format Final Content
            let finalContent = analysisMarkdown;
            if (includePrompt) {
                const recreatePrompt = `\n## Recreate Prompt\n> Build a website matching the above design specification.\n> Use the Brand Identity, Color Palette, and Typography details strictly.\n> Ensure the layout follows the Component Inventory and Page Structure.\n`;
                finalContent += recreatePrompt;
            }
            console.error(`[MCP] Successfully generated design spec for ${url}`);
            return {
                content: [
                    {
                        type: "text",
                        text: finalContent,
                    },
                ],
            };
        }
        catch (error) {
            if (error instanceof validator_1.BlockedScrapeError) {
                console.error("[MCP] Validation blocked scrape:", error.reason);
                return await handleBlockedScrapeError(error, url);
            }
            console.error("[MCP] Error during clone_website:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to clone website: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
    }
    else if (request.params.name === "clone_website_from_feedback") {
        const { url, feedbackContext, includePrompt = false } = request.params.arguments;
        try {
            console.error(`[MCP] Starting clone_website_from_feedback for URL ${url} with provided feedback context...`);
            // 1. Scrape
            const scrapedData = await (0, scraper_1.scrapeUrl)(url, firecrawlKey);
            // 2. Validation
            (0, validator_1.validateScrapeResult)(scrapedData);
            // 3. Analyze with feedback context
            const analysisMarkdown = await (0, analyzer_1.analyzeContent)(scrapedData, geminiKey, feedbackContext);
            // 4. Format Final Content
            let finalContent = analysisMarkdown;
            if (includePrompt) {
                const recreatePrompt = `\n## Recreate Prompt\n> Build a website matching the above design specification.\n> Use the Brand Identity, Color Palette, and Typography details strictly.\n> Ensure the layout follows the Component Inventory and Page Structure.\n`;
                finalContent += recreatePrompt;
            }
            console.error(`[MCP] Successfully generated design spec for ${url} with provided feedback`);
            return {
                content: [
                    {
                        type: "text",
                        text: finalContent,
                    },
                ],
            };
        }
        catch (error) {
            if (error instanceof validator_1.BlockedScrapeError) {
                console.error("[MCP] Validation blocked scrape from feedback:", error.reason);
                return await handleBlockedScrapeError(error, url);
            }
            console.error("[MCP] Error during clone_website_from_feedback:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to clone website from feedback: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
    }
    throw new Error("Tool not found");
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Website Cloner MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
