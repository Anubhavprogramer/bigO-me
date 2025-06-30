import * as vscode from 'vscode';
import { ComplexityResult } from './complexityAnalyzer';

export class ComplexityDecorationProvider {
    private analysisResults = new Map<string, Map<string, { range: vscode.Range; result: ComplexityResult; timestamp: number }>>();
    private decorationType: vscode.TextEditorDecorationType;
    private timeoutHandles = new Map<string, NodeJS.Timeout>();
    private readonly DISPLAY_DURATION = 5000; // 5 seconds

    constructor() {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 20px',
                fontStyle: 'italic',
                fontWeight: 'bold'
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }

    addAnalysisResult(uri: vscode.Uri, range: vscode.Range, result: ComplexityResult): void {
        const uriString = uri.toString();
        const rangeKey = `${range.start.line}:${range.start.character}-${range.end.line}:${range.end.character}`;
        
        if (!this.analysisResults.has(uriString)) {
            this.analysisResults.set(uriString, new Map());
        }
        
        const timestamp = Date.now();
        this.analysisResults.get(uriString)!.set(rangeKey, { range, result, timestamp });
        
        // Clear any existing timeout for this URI
        const existingTimeout = this.timeoutHandles.get(uriString);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        
        // Set timeout to automatically clear decorations after 5 seconds
        const timeoutHandle = setTimeout(() => {
            this.clearResults(uri);
            // Update decorations to remove them
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.uri.toString() === uriString) {
                this.updateDecorations(editor);
            }
        }, this.DISPLAY_DURATION);
        
        this.timeoutHandles.set(uriString, timeoutHandle);
    }

    updateDecorations(editor: vscode.TextEditor): void {
        const config = vscode.workspace.getConfiguration('complexityAnalyzer');
        if (!config.get('showInlineAnnotations')) {
            return;
        }

        const uriString = editor.document.uri.toString();
        const results = this.analysisResults.get(uriString);
        
        if (!results) {
            editor.setDecorations(this.decorationType, []);
            return;
        }

        const decorations: vscode.DecorationOptions[] = [];
        const currentTime = Date.now();
        
        results.forEach(({ range, result, timestamp }) => {
            // Check if the result has expired (older than 5 seconds)
            if (currentTime - timestamp > this.DISPLAY_DURATION) {
                return; // Skip expired results
            }
            
            const color = this.getComplexityColor(result.totalScore);
            const decoration: vscode.DecorationOptions = {
                range: range,
                renderOptions: {
                    after: {
                        contentText: ` T: O(${result.timeComplexity}), S: O(${result.spaceComplexity})`,
                        color: color,
                        backgroundColor: this.getComplexityBackgroundColor(result.totalScore),
                        border: '1px solid ' + color,
                        textDecoration: 'none; padding: 2px 4px; font-size: 11px;'
                    }
                },
                hoverMessage: this.createHoverMessage(result)
            };
            decorations.push(decoration);
        });

        editor.setDecorations(this.decorationType, decorations);
    }

    private getComplexityColor(score: number): string {
        if (score >= 8) return '#ff4444'; // Red for exponential
        if (score >= 4) return '#ff8800'; // Orange for quadratic
        if (score >= 2) return '#ffaa00'; // Yellow for linear
        return '#44aa44'; // Green for constant
    }

    private getComplexityBackgroundColor(score: number): string {
        if (score >= 8) return 'rgba(255, 68, 68, 0.2)'; // Red background
        if (score >= 4) return 'rgba(255, 136, 0, 0.2)'; // Orange background
        if (score >= 2) return 'rgba(255, 170, 0, 0.2)'; // Yellow background
        return 'rgba(68, 170, 68, 0.2)'; // Green background
    }

    private createHoverMessage(result: ComplexityResult): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        
        markdown.appendMarkdown(`### Complexity Analysis\\n\\n`);
        markdown.appendMarkdown(`**Time Complexity:** O(${result.timeComplexity})\\n\\n`);
        markdown.appendMarkdown(`**Space Complexity:** O(${result.spaceComplexity})\\n\\n`);
        
        if (result.details.length > 0) {
            markdown.appendMarkdown(`### Details:\\n\\n`);
            result.details.forEach(detail => {
                markdown.appendMarkdown(`- **Line ${detail.line}:** ${detail.description} - ${detail.complexity}\\n`);
            });
        }

        const complexity = this.getComplexityRating(result.totalScore);
        markdown.appendMarkdown(`\\n**Complexity Rating:** ${complexity}\\n`);
        
        return markdown;
    }

    private getComplexityRating(score: number): string {
        if (score >= 8) return '🔴 Exponential (Very High)';
        if (score >= 4) return '🟠 Quadratic (High)';
        if (score >= 2) return '🟡 Linear (Medium)';
        return '🟢 Constant (Low)';
    }

    clearResults(uri?: vscode.Uri): void {
        if (uri) {
            const uriString = uri.toString();
            this.analysisResults.delete(uriString);
            
            // Clear timeout for this URI
            const timeoutHandle = this.timeoutHandles.get(uriString);
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                this.timeoutHandles.delete(uriString);
            }
        } else {
            this.analysisResults.clear();
            
            // Clear all timeouts
            this.timeoutHandles.forEach(timeout => clearTimeout(timeout));
            this.timeoutHandles.clear();
        }
    }

    dispose(): void {
        this.decorationType.dispose();
        this.analysisResults.clear();
        
        // Clear all timeouts
        this.timeoutHandles.forEach(timeout => clearTimeout(timeout));
        this.timeoutHandles.clear();
    }
}
