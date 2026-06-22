import { scrapeUrl } from './src/scraper';
import { analyzeContent } from './src/analyzer';
import { generateDesignSpec } from './src/generator';
import { validateScrapeResult, BlockedScrapeError } from './src/validator';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const url = "https://stripe.com";
  const feedbackContext = {
    title: "Add URL-Based Website Design Inspiration",
    description: "Currently, Enter Pro supports template-based website creation, where users start with a predefined website template and customize it using AI. A valuable enhancement would be to allow users to provide a reference website URL. Enter Pro could analyze the website's design system—including layout, colors, typography, components, and animations—and automatically generate a design.md blueprint.",
    requirements: "1. Allow users to provide a reference website URL.\n2. Analyze the website's design system (layout, colors, typography, components, animations).\n3. Automatically generate a design.md blueprint.\n4. Store blueprint in Parcel as persistent project memory.\n5. Adding URL-based design inspiration to reduce prompt engineering effort."
  };

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!firecrawlKey || !geminiKey) {
    console.error("Missing API keys in .env file.");
    process.exit(1);
  }

  try {
    console.log(`Scraping ${url}...`);
    const scrapedData = await scrapeUrl(url, firecrawlKey);

    console.log("Validating scraped result...");
    validateScrapeResult(scrapedData);

    console.log("Analyzing with Gemini using Produck Feedback Context...");
    const analysisMarkdown = await analyzeContent(scrapedData, geminiKey, feedbackContext);

    console.log("Generating design.md...");
    generateDesignSpec(analysisMarkdown, "design.md", true);

    console.log("Successfully ran clone_website_from_feedback logic. Check design.md for the result.");
  } catch (error: any) {
    if (error instanceof BlockedScrapeError) {
      console.error(`\n❌ Validation Blocked Scrape!`);
      console.error(`Reason: ${error.reason}`);
      console.error(`Detected Issue: ${error.detectedIssue}`);
      console.error(`Final URL: ${error.finalUrl || url}`);
    } else {
      console.error("Failed:", error);
    }
  }
}

run();
