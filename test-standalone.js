// Standalone complexity analyzer test
// This imports only the analyzer without VS Code dependencies

// Import acorn for parsing
const acorn = require('acorn');

// Copy the ComplexityAnalyzer class for standalone testing
class ComplexityAnalyzer {
    
    analyzeCode(code, languageId) {
        switch (languageId) {
            case 'javascript':
            case 'typescript':
                return this.analyzeJavaScript(code);
            case 'python':
                return this.analyzePython(code);
            default:
                return this.analyzeGeneric(code);
        }
    }

    analyzeJavaScript(code) {
        try {
            // Parse the JavaScript/TypeScript code
            const ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true
            });

            const analyzer = new JSComplexityAnalyzer();
            return analyzer.analyze(ast, code);
        } catch (error) {
            console.error('JavaScript parsing error:', error);
            return this.analyzeGeneric(code);
        }
    }

    analyzePython(code) {
        // Basic Python complexity analysis using pattern matching
        return this.analyzeGeneric(code);
    }

    analyzeGeneric(code) {
        const lines = code.split('\n');
        let timeComplexity = 'n';
        let spaceComplexity = '1';
        const details = [];
        let totalScore = 1;

        // Analyze loops and nested structures
        let nestedLevel = 0;
        let maxNested = 0;
        let hasRecursion = false;
        let hasGraphTraversal = false;

        // Check for graph algorithm patterns first
        const graphPatterns = this.detectGraphAlgorithms(code);
        if (graphPatterns.length > 0) {
            hasGraphTraversal = true;
            details.push(...graphPatterns);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Check for loops
            if (this.isLoop(line)) {
                nestedLevel++;
                maxNested = Math.max(maxNested, nestedLevel);
                details.push({
                    type: 'loop',
                    description: 'Loop detected',
                    line: lineNumber,
                    complexity: `O(n${nestedLevel > 1 ? '^' + nestedLevel : ''})`
                });
            }

            // Check for recursion
            if (this.isRecursiveCall(line, code)) {
                hasRecursion = true;
                details.push({
                    type: 'recursion',
                    description: 'Recursive call detected',
                    line: lineNumber,
                    complexity: 'O(2^n) or O(n)'
                });
            }

            // Check for data structure operations
            if (this.isDataStructureOperation(line)) {
                details.push({
                    type: 'data-structure',
                    description: 'Data structure operation',
                    line: lineNumber,
                    complexity: 'O(1) to O(n)'
                });
            }

            // Reset nesting level at closing braces/blocks
            if (line.includes('}') || this.isBlockEnd(line)) {
                nestedLevel = Math.max(0, nestedLevel - 1);
            }
        }

        // Calculate final complexity
        if (hasGraphTraversal) {
            timeComplexity = 'E + V';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (hasRecursion) {
            timeComplexity = '2^n';
            totalScore = 8;
        } else if (maxNested >= 3) {
            timeComplexity = `n^${maxNested}`;
            totalScore = maxNested * 2;
        } else if (maxNested === 2) {
            timeComplexity = 'n^2';
            totalScore = 4;
        } else if (maxNested === 1) {
            timeComplexity = 'n';
            totalScore = 2;
        }

        // Space complexity analysis
        if (hasGraphTraversal) {
            spaceComplexity = 'V';
        } else if (hasRecursion) {
            spaceComplexity = 'n';
        } else if (this.hasLargeDataStructures(code)) {
            spaceComplexity = 'n';
        }

        return {
            timeComplexity,
            spaceComplexity,
            details,
            totalScore
        };
    }

    detectGraphAlgorithms(code) {
        const details = [];
        const lines = code.split('\n');
        
        // Look for graph traversal patterns
        let hasBFSPattern = false;
        let hasDFSPattern = false;
        let hasAdjacencyList = false;
        let hasQueue = false;
        let hasStack = false;
        let hasVisitedArray = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase().trim();
            const lineNumber = i + 1;
            
            // Check for adjacency list/graph structure
            if (line.includes('adjacency') || 
                line.includes('graph') || 
                line.includes('edges') || 
                line.includes('vertices') ||
                line.includes('neighbors') ||
                line.includes('adj')) {
                hasAdjacencyList = true;
            }
            
            // Check for queue (BFS indicator)
            if (line.includes('queue') || 
                line.includes('.shift()') || 
                line.includes('.unshift(') ||
                line.includes('deque') ||
                line.includes('collections.deque')) {
                hasQueue = true;
            }
            
            // Check for stack (DFS indicator) 
            if (line.includes('stack') || 
                line.includes('.push(') && line.includes('.pop()') ||
                line.includes('dfs') ||
                line.includes('depth')) {
                hasStack = true;
            }
            
            // Check for visited tracking
            if (line.includes('visited') || 
                line.includes('seen') ||
                line.includes('explored')) {
                hasVisitedArray = true;
            }
            
            // Direct BFS/DFS function names
            if (line.includes('bfs') || line.includes('breadth')) {
                hasBFSPattern = true;
                details.push({
                    type: 'graph-bfs',
                    description: 'Breadth-First Search detected',
                    line: lineNumber,
                    complexity: 'O(E + V)'
                });
            }
            
            if (line.includes('dfs') || line.includes('depth')) {
                hasDFSPattern = true;
                details.push({
                    type: 'graph-dfs', 
                    description: 'Depth-First Search detected',
                    line: lineNumber,
                    complexity: 'O(E + V)'
                });
            }
        }
        
        // Heuristic: if we have graph structure + traversal patterns
        if (hasAdjacencyList && hasVisitedArray) {
            if (hasQueue && !hasBFSPattern) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal with queue (likely BFS)',
                    line: 1,
                    complexity: 'O(E + V)'
                });
            } else if (hasStack && !hasDFSPattern) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal with stack (likely DFS)',
                    line: 1, 
                    complexity: 'O(E + V)'
                });
            } else if (!hasBFSPattern && !hasDFSPattern) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal pattern detected',
                    line: 1,
                    complexity: 'O(E + V)'
                });
            }
        }
        
        return details;
    }

    isLoop(line) {
        const loopPatterns = [
            /\bfor\s*\(/,
            /\bwhile\s*\(/,
            /\bdo\s*\{/,
            /\bfor\s+\w+\s+in\b/,
            /\bfor\s+.*\s+of\b/,
            /\.forEach\s*\(/,
            /\.map\s*\(/,
            /\.filter\s*\(/,
            /\.reduce\s*\(/
        ];
        return loopPatterns.some(pattern => pattern.test(line));
    }

    isRecursiveCall(line, fullCode) {
        // Simple heuristic: look for function calls that match function names in the code
        const functionNames = this.extractFunctionNames(fullCode);
        return functionNames.some(name => 
            line.includes(name + '(') && !line.includes('function ' + name)
        );
    }

    extractFunctionNames(code) {
        const functionPatterns = [
            /function\s+(\w+)/g,
            /const\s+(\w+)\s*=\s*\(/g,
            /let\s+(\w+)\s*=\s*\(/g,
            /var\s+(\w+)\s*=\s*\(/g,
            /(\w+)\s*:\s*function/g,
            /def\s+(\w+)\s*\(/g  // Python
        ];
        
        const names = [];
        functionPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                names.push(match[1]);
            }
        });
        
        return names;
    }

    isDataStructureOperation(line) {
        const patterns = [
            /\.push\s*\(/,
            /\.pop\s*\(/,
            /\.shift\s*\(/,
            /\.unshift\s*\(/,
            /\.sort\s*\(/,
            /\.indexOf\s*\(/,
            /\.find\s*\(/,
            /\.includes\s*\(/,
            /new\s+(Array|Map|Set|Object)/,
            /\.append\s*\(/,  // Python
            /\.insert\s*\(/,
            /\.remove\s*\(/
        ];
        return patterns.some(pattern => pattern.test(line));
    }

    isBlockEnd(line) {
        return line === 'end' || 
               line === 'fi' || 
               line === 'done' ||
               /^\s*except\s*:/.test(line) ||
               /^\s*finally\s*:/.test(line);
    }

    hasLargeDataStructures(code) {
        const patterns = [
            /new\s+Array\s*\(/,
            /\[\s*.{20,}\s*\]/,  // Large array literals
            /new\s+(Map|Set|Object)\s*\(/,
            /\{\s*.{20,}\s*\}/,  // Large object literals
            /list\s*\(/,  // Python
            /dict\s*\(/,
            /set\s*\(/
        ];
        return patterns.some(pattern => pattern.test(code));
    }
}

class JSComplexityAnalyzer {
    constructor() {
        this.details = [];
        this.nestedLevel = 0;
        this.maxNested = 0;
        this.hasRecursion = false;
        this.codeLines = [];
    }

    analyze(ast, code) {
        this.codeLines = code.split('\n');
        this.details = [];
        this.nestedLevel = 0;
        this.maxNested = 0;
        this.hasRecursion = false;

        // Check for graph algorithms first
        const analyzer = new ComplexityAnalyzer();
        const graphPatterns = analyzer.detectGraphAlgorithms(code);
        const hasGraphTraversal = graphPatterns.length > 0;
        this.details.push(...graphPatterns);

        this.visit(ast);

        let timeComplexity = '1';
        let spaceComplexity = '1';
        let totalScore = 1;

        if (hasGraphTraversal) {
            timeComplexity = 'E + V';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (this.hasRecursion) {
            timeComplexity = '2^n';
            totalScore = 8;
            spaceComplexity = 'n';
        } else if (this.maxNested >= 3) {
            timeComplexity = `n^${this.maxNested}`;
            totalScore = this.maxNested * 2;
        } else if (this.maxNested === 2) {
            timeComplexity = 'n^2';
            totalScore = 4;
        } else if (this.maxNested === 1) {
            timeComplexity = 'n';
            totalScore = 2;
        }

        return {
            timeComplexity,
            spaceComplexity,
            details: this.details,
            totalScore
        };
    }

    visit(node) {
        if (!node) return;

        switch (node.type) {
            case 'ForStatement':
            case 'WhileStatement':
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForOfStatement':
                this.handleLoop(node);
                break;
            case 'CallExpression':
                this.handleCallExpression(node);
                break;
            default:
                break;
        }

        // Visit child nodes
        for (const key in node) {
            if (node.hasOwnProperty(key)) {
                const child = node[key];
                if (child && typeof child === 'object') {
                    if (Array.isArray(child)) {
                        child.forEach(c => this.visit(c));
                    } else {
                        this.visit(child);
                    }
                }
            }
        }

        // Decrease nesting level when exiting loop
        if (['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForInStatement', 'ForOfStatement'].includes(node.type)) {
            this.nestedLevel--;
        }
    }

    handleLoop(node) {
        this.nestedLevel++;
        this.maxNested = Math.max(this.maxNested, this.nestedLevel);
        
        const line = node.loc?.start?.line || 1;
        this.details.push({
            type: 'loop',
            description: `${node.type} detected`,
            line,
            complexity: `O(n${this.nestedLevel > 1 ? '^' + this.nestedLevel : ''})`
        });
    }

    handleCallExpression(node) {
        // Check for recursive calls and array methods
        if (node.callee?.name) {
            const line = node.loc?.start?.line || 1;
            
            // Check for array methods that might indicate O(n) operations
            if (['map', 'filter', 'reduce', 'forEach', 'find', 'sort'].includes(node.callee.property?.name)) {
                this.details.push({
                    type: 'array-method',
                    description: `Array.${node.callee.property.name}() detected`,
                    line,
                    complexity: 'O(n)'
                });
            }
        }
    }
}

// Test the analyzer
const testCodes = {
    simple: `function simple(x) { return x + 1; }`,
    linear: `function linear(arr) {
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i]);
        }
    }`,
    quadratic: `function quadratic(n) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                console.log(i, j);
            }
        }
    }`,
    recursive: `function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }`,
    graphBFS: `function bfs(graph, start) {
        const visited = new Set();
        const queue = [start];
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            if (!visited.has(node)) {
                visited.add(node);
                console.log(node);
                
                for (const neighbor of graph[node]) {
                    if (!visited.has(neighbor)) {
                        queue.push(neighbor);
                    }
                }
            }
        }
    }`,
    graphDFS: `function dfs(graph, start, visited = new Set()) {
        visited.add(start);
        console.log(start);
        
        for (const neighbor of graph[start]) {
            if (!visited.has(neighbor)) {
                dfs(graph, neighbor, visited);
            }
        }
    }`,
    dagLongestPath: `function longestPathDAG(V, edges, source) {
        const adj = Array.from({ length: V }, () => []);
        const inDegree = Array(V).fill(0);
        
        for (const [u, v] of edges) {
            adj[u].push(v);
            inDegree[v]++;
        }
        
        const queue = [];
        for (let i = 0; i < V; i++) {
            if (inDegree[i] === 0) {
                queue.push(i);
            }
        }
        
        const topoOrder = [];
        while (queue.length > 0) {
            const node = queue.shift();
            topoOrder.push(node);
            
            for (const neighbor of adj[node]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }
        
        const dp = Array(V).fill(-Infinity);
        dp[source] = 0;
        
        for (const u of topoOrder) {
            if (dp[u] !== -Infinity) {
                for (const v of adj[u]) {
                    dp[v] = Math.max(dp[v], dp[u] + 1);
                }
            }
        }
        
        return Math.max(...dp);
    }`
};

console.log('🔍 Testing Code Complexity Analyzer...\n');

const analyzer = new ComplexityAnalyzer();

Object.entries(testCodes).forEach(([name, code]) => {
    console.log(`\n📊 Testing ${name} function:`);
    console.log(`Code: ${code.substring(0, 50)}...`);
    
    try {
        const result = analyzer.analyzeCode(code, 'javascript');
        console.log(`⏱️  Time Complexity: O(${result.timeComplexity})`);
        console.log(`💾 Space Complexity: O(${result.spaceComplexity})`);
        console.log(`📈 Score: ${result.totalScore}/10`);
        console.log(`📝 Details: ${result.details.length} patterns detected`);
        
        if (result.details.length > 0) {
            result.details.forEach(detail => {
                console.log(`   - Line ${detail.line}: ${detail.description} (${detail.complexity})`);
            });
        }
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
    
    console.log('─'.repeat(60));
});

console.log('\n✅ Test completed!');
