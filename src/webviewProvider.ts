import * as vscode from 'vscode';

export class ComplexityWebviewProvider {
    public static readonly viewType = 'complexityAnalyzer.report';
    private _panel: vscode.WebviewPanel | undefined = undefined;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public createOrShow(): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (this._panel) {
            this._panel.reveal(column);
            return;
        }

        this._panel = vscode.window.createWebviewPanel(
            ComplexityWebviewProvider.viewType,
            'Complexity Analysis Report',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(this._extensionUri, 'media')
                ]
            }
        );

        this._panel.webview.html = this._getHtmlForWebview();

        this._panel.onDidDispose(() => {
            this._panel = undefined;
        }, null);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'analyzeCurrentFile':
                        this.analyzeCurrentFile();
                        break;
                    case 'exportReport':
                        this.exportReport(message.data);
                        break;
                }
            }
        );
    }

    private _getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Complexity Analysis Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        
        .header {
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            color: var(--vscode-textLink-foreground);
        }
        
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .card h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--vscode-descriptionForeground);
        }
        
        .card .value {
            font-size: 24px;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .complexity-high { color: #ff4444; }
        .complexity-medium { color: #ffaa00; }
        .complexity-low { color: #44aa44; }
        
        .details-section {
            margin-top: 30px;
        }
        
        .details-section h2 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        
        .function-analysis {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 15px;
            margin: 10px 0;
        }
        
        .function-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .complexity-metrics {
            display: flex;
            gap: 20px;
            margin: 10px 0;
            flex-wrap: wrap;
        }
        
        .metric {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
        }
        
        .issues-list {
            margin-top: 10px;
        }
        
        .issue {
            display: flex;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        .issue-icon {
            margin-right: 10px;
            font-size: 16px;
        }
        
        .issue-high { color: #ff4444; }
        .issue-medium { color: #ffaa00; }
        .issue-low { color: #44aa44; }
        
        .actions {
            margin-top: 30px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--vscode-descriptionForeground);
        }
        
        .empty-state h3 {
            margin-bottom: 10px;
            color: var(--vscode-editor-foreground);
        }
        
        @media (max-width: 600px) {
            .summary-cards {
                grid-template-columns: 1fr;
            }
            
            .complexity-metrics {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Code Complexity Analysis Report</h1>
        <p>Analyze the time and space complexity of your code to optimize performance</p>
    </div>

    <div id="content">
        <div class="empty-state">
            <h3>📊 No Analysis Available</h3>
            <p>Click "Analyze Current File" to start analyzing your code's complexity</p>
            <button class="btn" onclick="analyzeCurrentFile()">
                🔍 Analyze Current File
            </button>
        </div>
    </div>

    <div class="actions">
        <button class="btn" onclick="analyzeCurrentFile()">
            🔍 Analyze Current File
        </button>
        <button class="btn btn-secondary" onclick="exportReport()">
            📄 Export Report
        </button>
        <button class="btn btn-secondary" onclick="refreshReport()">
            🔄 Refresh
        </button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function analyzeCurrentFile() {
            vscode.postMessage({
                command: 'analyzeCurrentFile'
            });
        }

        function exportReport() {
            const reportData = document.getElementById('content').innerHTML;
            vscode.postMessage({
                command: 'exportReport',
                data: reportData
            });
        }

        function refreshReport() {
            location.reload();
        }

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateReport':
                    updateReport(message.data);
                    break;
            }
        });

        function updateReport(data) {
            const content = document.getElementById('content');
            
            if (!data || data.length === 0) {
                content.innerHTML = \`
                    <div class="empty-state">
                        <h3>📊 No Analysis Available</h3>
                        <p>Click "Analyze Current File" to start analyzing your code's complexity</p>
                        <button class="btn" onclick="analyzeCurrentFile()">
                            🔍 Analyze Current File
                        </button>
                    </div>
                \`;
                return;
            }

            let html = \`
                <div class="summary-cards">
                    <div class="card">
                        <h3>Average Time Complexity</h3>
                        <div class="value complexity-medium">O(n)</div>
                    </div>
                    <div class="card">
                        <h3>Average Space Complexity</h3>
                        <div class="value complexity-low">O(1)</div>
                    </div>
                    <div class="card">
                        <h3>Functions Analyzed</h3>
                        <div class="value">\${data.length}</div>
                    </div>
                    <div class="card">
                        <h3>Complexity Score</h3>
                        <div class="value complexity-medium">6.2/10</div>
                    </div>
                </div>

                <div class="details-section">
                    <h2>📋 Detailed Analysis</h2>
            \`;

            data.forEach(item => {
                html += \`
                    <div class="function-analysis">
                        <div class="function-name">\${item.name || 'Code Block'}</div>
                        <div class="complexity-metrics">
                            <span class="metric">Time: O(\${item.timeComplexity})</span>
                            <span class="metric">Space: O(\${item.spaceComplexity})</span>
                            <span class="metric">Score: \${item.score}/10</span>
                        </div>
                        <div class="issues-list">
                \`;

                if (item.details && item.details.length > 0) {
                    item.details.forEach(detail => {
                        const severity = detail.complexity.includes('2^n') ? 'high' : 
                                       detail.complexity.includes('n^') ? 'medium' : 'low';
                        const icon = severity === 'high' ? '🔴' : 
                                   severity === 'medium' ? '🟡' : '🟢';
                        
                        html += \`
                            <div class="issue">
                                <span class="issue-icon issue-\${severity}">\${icon}</span>
                                <span>Line \${detail.line}: \${detail.description} - \${detail.complexity}</span>
                            </div>
                        \`;
                    });
                }

                html += \`
                        </div>
                    </div>
                \`;
            });

            html += '</div>';
            content.innerHTML = html;
        }
    </script>
</body>
</html>`;
    }

    private analyzeCurrentFile(): void {
        vscode.commands.executeCommand('complexityAnalyzer.analyzeComplexity');
    }

    private exportReport(reportData: string): void {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Code Complexity Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .complexity-high { color: #ff4444; }
        .complexity-medium { color: #ffaa00; }
        .complexity-low { color: #44aa44; }
    </style>
</head>
<body>
    <h1>Code Complexity Analysis Report</h1>
    <p>Generated on: ${new Date().toLocaleDateString()}</p>
    ${reportData}
</body>
</html>`;

        vscode.workspace.openTextDocument({
            content: htmlContent,
            language: 'html'
        }).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }
}
