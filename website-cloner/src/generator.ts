import * as fs from 'fs';
import * as path from 'path';

export function generateDesignSpec(designMarkdown: string, outputFilePath: string, includePrompt: boolean) {
  let finalContent = designMarkdown;

  if (includePrompt) {
    const recreatePrompt = `
## Recreate Prompt
> Build a website matching the above design specification.
> Use the Brand Identity, Color Palette, and Typography details strictly.
> Ensure the layout follows the Component Inventory and Page Structure.
`;
    finalContent += `\n${recreatePrompt}\n`;
  }

  const resolvedPath = path.resolve(process.cwd(), outputFilePath);

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(resolvedPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(resolvedPath, finalContent, 'utf-8');
  console.log(`[Generator] Design specification written to ${resolvedPath}`);
}
