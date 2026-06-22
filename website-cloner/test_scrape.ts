import { scrapeUrl } from './src/scraper';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const url = "https://stripe.com";
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) throw new Error("No API key");

  const scrapedData = await scrapeUrl(url, firecrawlKey);
  const rawHtml = scrapedData.html || "";
  const fs = require('fs');
  fs.writeFileSync('html_output.txt', rawHtml.substring(0, 2000));
  console.log("Wrote first 2000 chars to html_output.txt");
  
  console.log("Contains #635BFF (case-insensitive):", /#635BFF/i.test(rawHtml));
  console.log("Contains #031323 (case-insensitive):", /#031323/i.test(rawHtml));
  console.log("Contains #635bff (case-insensitive):", /#635bff/i.test(rawHtml));
  
  // check CSS variables
  const cssVarsMatch = rawHtml.match(/--[a-zA-Z0-9-]+:\s*[^;"]+;/g);
  console.log(`Found ${cssVarsMatch ? cssVarsMatch.length : 0} CSS variable definitions.`);
  if (cssVarsMatch && cssVarsMatch.length > 0) {
     console.log("Some CSS variables:", cssVarsMatch.slice(0, 5));
  }
}

run().catch(console.error);
