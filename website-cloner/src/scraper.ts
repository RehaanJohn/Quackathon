export interface ScrapeResult {
  markdown?: string;
  html?: string;
  metadata?: any;
}

export async function scrapeUrl(url: string, apiKey: string): Promise<ScrapeResult> {
  console.error(`[Scraper] Requesting scrape for ${url} via Firecrawl REST API...`);
  
  const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: url,
      formats: ["markdown", "rawHtml"],
      // metadata is typically included automatically or we can request it if needed
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Scraper] Firecrawl API returned an error:", response.status, errorText);
    throw new Error(`Failed to scrape URL via Firecrawl API: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error("Firecrawl API response did not indicate success or lacked data.");
  }

  return {
    markdown: result.data.markdown,
    html: result.data.rawHtml,
    metadata: result.data.metadata
  };
}
