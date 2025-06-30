// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ComplexityAnalyzer } from './complexityAnalyzer';
import { ComplexityDecorationProvider } from './decorationProvider';
import { ComplexityWebviewProvider } from './webviewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Code Complexity Analyzer extension is now active!');

    const analyzer = new ComplexityAnalyzer();
    const decorationProvider = new ComplexityDecorationProvider();
    const webviewProvider = new ComplexityWebviewProvider(context.extensionUri);

    // Register commands
    const analyzeComplexityCommand = vscode.commands.registerCommand(
        'complexityAnalyzer.analyzeComplexity',
        () => analyzeSelectedCode(analyzer, decorationProvider)
    );

    const showReportCommand = vscode.commands.registerCommand(
        'complexityAnalyzer.showComplexityReport',
        () => showComplexityReport(webviewProvider)
    );

    // Register automatic analysis on file save
    const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        const config = vscode.workspace.getConfiguration('complexityAnalyzer');
        if (config.get('enableAutoAnalysis')) {
            analyzeDocument(document, analyzer, decorationProvider);
        }
    });

    // Register active editor change to update decorations
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            decorationProvider.updateDecorations(editor);
        }
    });

    context.subscriptions.push(
        analyzeComplexityCommand,
        showReportCommand,
        onDidSaveTextDocument,
        onDidChangeActiveTextEditor
    );
}

async function analyzeSelectedCode(analyzer: ComplexityAnalyzer, decorationProvider: ComplexityDecorationProvider) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    
    let code: string;
    let range: vscode.Range;
    
    if (selection.isEmpty) {
        // Analyze entire document if no selection
        code = document.getText();
        range = new vscode.Range(0, 0, document.lineCount - 1, 0);
    } else {
        // Analyze selected code
        code = document.getText(selection);
        range = selection;
    }

    try {
        const result = analyzer.analyzeCode(code, document.languageId);
        
        // Store results for decoration
        decorationProvider.addAnalysisResult(document.uri, range, result);
        decorationProvider.updateDecorations(editor);
        
        // Show quick result
        const message = `Time Complexity: O(${result.timeComplexity}), Space Complexity: O(${result.spaceComplexity})`;
        vscode.window.showInformationMessage(message);
        
    } catch (error) {
        vscode.window.showErrorMessage(`Analysis failed: ${error}`);
    }
}

async function analyzeDocument(
    document: vscode.TextDocument, 
    analyzer: ComplexityAnalyzer, 
    decorationProvider: ComplexityDecorationProvider
) {
    if (!isSupportedLanguage(document.languageId)) {
        return;
    }

    try {
        const code = document.getText();
        const result = analyzer.analyzeCode(code, document.languageId);
        const range = new vscode.Range(0, 0, document.lineCount - 1, 0);
        
        decorationProvider.addAnalysisResult(document.uri, range, result);
        
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.toString() === document.uri.toString()) {
            decorationProvider.updateDecorations(editor);
        }
    } catch (error) {
        console.error('Auto-analysis failed:', error);
    }
}

function showComplexityReport(webviewProvider: ComplexityWebviewProvider) {
    webviewProvider.createOrShow();
}

function isSupportedLanguage(languageId: string): boolean {
    const supportedLanguages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp'
    ];
    return supportedLanguages.includes(languageId);
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('Code Complexity Analyzer extension is now deactivated');
}
