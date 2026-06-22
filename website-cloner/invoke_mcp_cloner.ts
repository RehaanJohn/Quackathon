import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as fs from "fs";

const url = process.argv[2] || "https://stripe.com";
const user_id = process.argv[3] || "default_mcp_user";

async function run() {
  // Connect to the local MCP server running via ts-node
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["ts-node", "src/index.ts"],
    stderr: "inherit", // Pipe stderr to our console to see console.error logs
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  console.log(`\x1b[95m[Website Cloner] Connecting to local MCP via stdio...\x1b[0m`);
  await client.connect(transport);

  console.log(`\n\x1b[1m\x1b[95m[Website Cloner] Invoking 'clone_website' tool for ${url} (Project: ${user_id})\x1b[0m`);
  try {
    const result = await client.callTool({
      name: "clone_website",
      arguments: {
        url: url,
        user_id: user_id,
        includePrompt: false
      }
    });

    if (result.isError) {
      console.error("Tool execution returned an error:");
      console.error(result.content);
      process.exit(1);
    } else {
      // Extract the text content
      const textContent = (result.content as any)[0].text;
      const outputPath = "design_mcp_output.md";
      fs.writeFileSync(outputPath, textContent);
      console.log(`Successfully received output and wrote to ${outputPath}`);
    }
  } catch (error) {
    console.error("Fatal error calling tool:", error);
    process.exit(1);
  }

  // Close connection
  await transport.close();
  console.log("Done.");
  process.exit(0);
}

run().catch(console.error);
