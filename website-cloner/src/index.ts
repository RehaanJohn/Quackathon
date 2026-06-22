import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from 'dotenv';
import * as path from 'path';
import { scrapeUrl } from './scraper';
import { analyzeContent } from './analyzer';
import { generateDesignSpec } from './generator';
import { validateScrapeResult, BlockedScrapeError } from './validator';
import { saveBlockedAttempt } from './parcel';

async function handleBlockedScrapeError(error: BlockedScrapeError, requestedUrl: string) {
  try {
    await saveBlockedAttempt({
      url: requestedUrl,
      reason: error.reason,
      detectedIssue: error.detectedIssue,
      requestedUrl: requestedUrl,
      finalUrl: error.finalUrl || requestedUrl
    });
  } catch (err) {
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

const server = new Server(
  {
    name: "website-cloner-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "clone_website") {
    const { url, includePrompt = false } = request.params.arguments as any;

    try {
      console.error(`[MCP] Starting clone_website for ${url}...`);
      
      // 1. Scrape
      const scrapedData = await scrapeUrl(url, firecrawlKey);

      // Validation
      validateScrapeResult(scrapedData);

      // 2. Analyze
      const analysisMarkdown = await analyzeContent(scrapedData, geminiKey);

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
    } catch (error: any) {
      if (error instanceof BlockedScrapeError) {
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
  } else if (request.params.name === "clone_website_from_feedback") {
    const { url, feedbackContext, includePrompt = false } = request.params.arguments as any;

    try {
      console.error(`[MCP] Starting clone_website_from_feedback for URL ${url} with provided feedback context...`);
      
      // 1. Scrape
      const scrapedData = await scrapeUrl(url, firecrawlKey);

      // 2. Validation
      validateScrapeResult(scrapedData);

      // 3. Analyze with feedback context
      const analysisMarkdown = await analyzeContent(scrapedData, geminiKey, feedbackContext);

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
    } catch (error: any) {
      if (error instanceof BlockedScrapeError) {
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
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Website Cloner MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
