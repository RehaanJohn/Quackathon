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
