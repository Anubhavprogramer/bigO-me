import * as vscode from 'vscode';
import { ComplexityResult } from './complexityAnalyzer';

export class ComplexityDecorationProvider {
    private analysisResults = new Map<string, Map<string, { range: vscode.Range; result: ComplexityResult; timestamp: number }>>();
    private decorationType: vscode.TextEditorDecorationType;
    private timeoutHandles = new Map<string, NodeJS.Timeout>();
    private refreshInterval: NodeJS.Timeout | null = null;
    private readonly DISPLAY_DURATION = 5000; // 5 seconds
    private readonly REFRESH_INTERVAL = 1000; // Check every second

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
        
        // Start refresh interval if not already running
        if (!this.refreshInterval) {
            this.startRefreshInterval();
        }
    }

    private startRefreshInterval(): void {
        this.refreshInterval = setInterval(() => {
            // Update decorations for the active editor
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                this.updateDecorations(editor);
            }
        }, this.REFRESH_INTERVAL);
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
        const expiredKeys: string[] = [];
        
        results.forEach(({ range, result, timestamp }, key) => {
            // Check if the result has expired (older than 5 seconds)
            if (currentTime - timestamp > this.DISPLAY_DURATION) {
                expiredKeys.push(key);
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

        // Clean up expired entries
        expiredKeys.forEach(key => {
            results.delete(key);
        });

        // If no results left, clear the map entry
        if (results.size === 0) {
            this.analysisResults.delete(uriString);
            const timeoutHandle = this.timeoutHandles.get(uriString);
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                this.timeoutHandles.delete(uriString);
            }
        }

        editor.setDecorations(this.decorationType, decorations);
    }

    private getComplexityColor(score: number): string {
        if (score >= 8) return '#ff4444'; // Red for exponential
        if (score >= 6) return '#ffaa00'; // Yellow for graph algorithms (V+E)
        if (score >= 4) return '#ff8800'; // Orange for quadratic
        if (score >= 2) return '#88cc00'; // Light green for linear
        return '#44aa44'; // Green for constant
    }

    private getComplexityBackgroundColor(score: number): string {
        if (score >= 8) return 'rgba(255, 68, 68, 0.2)'; // Red background
        if (score >= 6) return 'rgba(255, 170, 0, 0.2)'; // Yellow background for graph
        if (score >= 4) return 'rgba(255, 136, 0, 0.2)'; // Orange background
        if (score >= 2) return 'rgba(136, 204, 0, 0.2)'; // Light green background
        return 'rgba(68, 170, 68, 0.2)'; // Green background
    }

    private createHoverMessage(result: ComplexityResult): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        markdown.supportHtml = false;
        
        markdown.appendMarkdown(`## Complexity Analysis\n\n`);
        markdown.appendMarkdown(`**Time Complexity:** O(${result.timeComplexity})\n\n`);
        markdown.appendMarkdown(`**Space Complexity:** O(${result.spaceComplexity})\n\n`);
        
        if (result.details.length > 0) {
            markdown.appendMarkdown(`### Analysis Details:\n\n`);
            result.details.forEach((detail, index) => {
                markdown.appendMarkdown(`${index + 1}. **Line ${detail.line}:** ${detail.description}\n`);
                markdown.appendMarkdown(`   - Complexity: ${detail.complexity}\n\n`);
            });
        }

        const complexity = this.getComplexityRating(result.totalScore);
        markdown.appendMarkdown(`**Complexity Rating:** ${complexity}\n\n`);
        
        // Add explanation for graph algorithms
        if (result.timeComplexity.includes('V + E') || result.timeComplexity.includes('E + V')) {
            markdown.appendMarkdown(`---\n\n`);
            markdown.appendMarkdown(`**Where:**\n`);
            markdown.appendMarkdown(`- **V** = Number of vertices (nodes)\n`);
            markdown.appendMarkdown(`- **E** = Number of edges\n\n`);
            markdown.appendMarkdown(`This is optimal for graph algorithms!\n`);
        }
        
        return markdown;
    }

    private getComplexityRating(score: number): string {
        if (score >= 8) return '🔴 Exponential (Very High)';
        if (score >= 6) return '🟡 Graph Algorithm (Medium-High)';
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
        
        // Clear refresh interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        // Clear all timeouts (kept for backwards compatibility)
        this.timeoutHandles.forEach(timeout => clearTimeout(timeout));
        this.timeoutHandles.clear();
    }
}
