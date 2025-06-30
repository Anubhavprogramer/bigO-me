<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Code Complexity Analyzer VS Code Extension

This is a VS Code extension project that analyzes the time and space complexity of code. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Structure
- `src/extension.ts` - Main extension entry point
- `src/complexityAnalyzer.ts` - Core complexity analysis logic
- `src/decorationProvider.ts` - Handles inline complexity annotations
- `src/webviewProvider.ts` - Provides detailed complexity reports

## Key Features
- Analyzes JavaScript, TypeScript, Python, and other languages
- Provides inline complexity annotations
- Shows detailed reports in a webview
- Supports automatic analysis on file save
- Detects loops, recursion, and data structure operations

## Development Guidelines
- Use TypeScript for all source files
- Follow VS Code extension best practices
- Test with multiple programming languages
- Ensure proper error handling for code parsing
- Use semantic analysis where possible for accuracy
