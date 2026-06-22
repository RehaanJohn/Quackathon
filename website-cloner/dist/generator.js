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
exports.generateDesignSpec = generateDesignSpec;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function generateDesignSpec(designMarkdown, outputFilePath, includePrompt) {
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
