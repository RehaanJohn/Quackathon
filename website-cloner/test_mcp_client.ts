import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as fs from "fs";

async function run() {
  console.log("Starting MCP Client...");
  
  // Connect to the local MCP server running via ts-node
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["ts-node", "src/index.ts"],
    stderr: "inherit", // Pipe stderr to our console to see console.error logs
  });

  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log("Connected to MCP Server!");

  console.log("Calling clone_website tool...");
  const result = await client.callTool({
    name: "clone_website",
    arguments: {
      url: "https://stripe.com",
      includePrompt: true
    }
  });

  if (result.isError) {
    console.error("Tool execution returned an error:");
    console.error(result.content);
  } else {
    // Extract the text content
    const textContent = (result.content as any)[0].text;
    const outputPath = "design_mcp_output.md";
    fs.writeFileSync(outputPath, textContent);
    console.log(`Successfully received output and wrote to ${outputPath}`);
  }

  // Close connection
  await transport.close();
  console.log("Done.");
}

run().catch(console.error);
