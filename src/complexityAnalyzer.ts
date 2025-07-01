import * as acorn from 'acorn';
import { Node } from 'acorn';

export interface ComplexityResult {
    timeComplexity: string;
    spaceComplexity: string;
    details: ComplexityDetails[];
    totalScore: number;
}

export interface ComplexityDetails {
    type: string;
    description: string;
    line: number;
    complexity: string;
}

export class ComplexityAnalyzer {
    
    analyzeCode(code: string, languageId: string): ComplexityResult {
        switch (languageId) {
            case 'javascript':
            case 'typescript':
                return this.analyzeJavaScript(code);
            case 'python':
                return this.analyzePython(code);
            case 'java':
                return this.analyzeJava(code);
            case 'c':
            case 'cpp':
                return this.analyzeC(code);
            default:
                return this.analyzeGeneric(code);
        }
    }

    private analyzeJavaScript(code: string): ComplexityResult {
        try {
            // Parse the JavaScript/TypeScript code
            const ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true
            });

            const analyzer = new JSComplexityAnalyzer();
            return analyzer.analyze(ast as any, code);
        } catch (error) {
            console.error('JavaScript parsing error:', error);
            return this.analyzeGeneric(code);
        }
    }

    private analyzePython(code: string): ComplexityResult {
        const analyzer = new PythonComplexityAnalyzer();
        return analyzer.analyze(code);
    }

    private analyzeJava(code: string): ComplexityResult {
        const analyzer = new JavaComplexityAnalyzer();
        return analyzer.analyze(code);
    }

    private analyzeC(code: string): ComplexityResult {
        const analyzer = new CComplexityAnalyzer();
        return analyzer.analyze(code);
    }

    private analyzeGeneric(code: string): ComplexityResult {
        const lines = code.split('\n');
        let timeComplexity = 'n';
        let spaceComplexity = '1';
        const details: ComplexityDetails[] = [];
        let totalScore = 1;

        // Analyze loops and nested structures
        let nestedLevel = 0;
        let maxNested = 0;
        let hasRecursion = false;
        let hasGraphTraversal = false;
        let loopVariables: string[] = []; // Track loop variables

        // Check for graph algorithm patterns first
        const graphPatterns = this.detectGraphAlgorithms(code);
        if (graphPatterns.length > 0) {
            hasGraphTraversal = true;
            details.push(...graphPatterns);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Check for loops with variable analysis
            const loopInfo = this.analyzeLoopWithVariables(line);
            if (loopInfo.isLoop) {
                nestedLevel++;
                maxNested = Math.max(maxNested, nestedLevel);
                
                // Track loop variables for better complexity analysis
                if (loopInfo.variables.length > 0) {
                    loopVariables.push(...loopInfo.variables);
                }

                details.push({
                    type: 'loop',
                    description: `Loop detected${loopInfo.variables.length > 0 ? ` (variables: ${loopInfo.variables.join(', ')})` : ''}`,
                    line: lineNumber,
                    complexity: this.calculateLoopComplexity(nestedLevel, loopVariables)
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
                // Remove variables when exiting loop scope
                if (nestedLevel < loopVariables.length) {
                    loopVariables.pop();
                }
            }
        }

        // Calculate final complexity with enhanced logic
        if (hasGraphTraversal) {
            timeComplexity = 'V + E';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (hasRecursion) {
            timeComplexity = '2^n';
            totalScore = 8;
        } else {
            const complexityResult = this.calculateFinalComplexity(maxNested, loopVariables);
            timeComplexity = complexityResult.complexity;
            totalScore = complexityResult.score;
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

    public detectGraphAlgorithms(code: string): ComplexityDetails[] {
        const details: ComplexityDetails[] = [];
        const lines = code.split('\n');
        
        // Look for graph traversal patterns
        let hasBFSPattern = false;
        let hasDFSPattern = false;
        let hasDAGPattern = false;
        let hasAdjacencyList = false;
        let hasQueue = false;
        let hasStack = false;
        let hasVisitedArray = false;
        let hasTopologicalSort = false;
        let hasInDegree = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase().trim();
            const originalLine = lines[i].trim();
            const lineNumber = i + 1;
            
            // Check for adjacency list/graph structure
            if (line.includes('adjacency') || 
                line.includes('graph') || 
                line.includes('edges') || 
                line.includes('vertices') ||
                line.includes('neighbors') ||
                line.includes('adj') ||
                originalLine.includes('[u, v]') ||
                originalLine.includes('[source, target]') ||
                originalLine.includes('adj[u]') ||
                originalLine.includes('adj[node]')) {
                hasAdjacencyList = true;
            }
            
            // Check for DAG-specific patterns
            if (line.includes('indegree') || 
                line.includes('in_degree') ||
                line.includes('topological') ||
                line.includes('topo') ||
                line.includes('dag') ||
                originalLine.includes('inDegree') ||
                originalLine.includes('topoOrder')) {
                hasDAGPattern = true;
                if (line.includes('indegree') || originalLine.includes('inDegree')) {
                    hasInDegree = true;
                }
                if (line.includes('topological') || line.includes('topo') || originalLine.includes('topoOrder')) {
                    hasTopologicalSort = true;
                }
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
                (line.includes('.push(') && line.includes('.pop()')) ||
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
            
            // Direct algorithm pattern detection
            if (line.includes('bfs') || line.includes('breadth')) {
                hasBFSPattern = true;
                details.push({
                    type: 'graph-bfs',
                    description: 'Breadth-First Search detected',
                    line: lineNumber,
                    complexity: 'O(V + E)'
                });
            }
            
            if (line.includes('dfs') || line.includes('depth')) {
                hasDFSPattern = true;
                details.push({
                    type: 'graph-dfs', 
                    description: 'Depth-First Search detected',
                    line: lineNumber,
                    complexity: 'O(V + E)'
                });
            }

            if (line.includes('longestpath') || 
                line.includes('shortest') ||
                line.includes('path') && hasDAGPattern) {
                details.push({
                    type: 'graph-dag',
                    description: 'DAG path algorithm detected',
                    line: lineNumber,
                    complexity: 'O(V + E)'
                });
            }
        }
        
        // Heuristic detection for graph algorithms
        if (hasAdjacencyList || hasDAGPattern) {
            if (hasInDegree && hasTopologicalSort && !details.some(d => d.type === 'graph-dag')) {
                details.push({
                    type: 'graph-dag',
                    description: 'DAG algorithm with topological sort',
                    line: 1,
                    complexity: 'O(V + E)'
                });
            } else if (hasQueue && hasVisitedArray && !hasBFSPattern) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal with queue (BFS pattern)',
                    line: 1,
                    complexity: 'O(V + E)'
                });
            } else if (hasStack && hasVisitedArray && !hasDFSPattern) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal with stack (DFS pattern)',
                    line: 1, 
                    complexity: 'O(V + E)'
                });
            } else if (hasAdjacencyList && (hasVisitedArray || hasQueue || hasStack) && details.length === 0) {
                details.push({
                    type: 'graph-traversal',
                    description: 'Graph traversal pattern detected',
                    line: 1,
                    complexity: 'O(V + E)'
                });
            }
        }
        
        return details;
    }

    private isLoop(line: string): boolean {
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

    private isRecursiveCall(line: string, fullCode: string): boolean {
        // Simple heuristic: look for function calls that match function names in the code
        const functionNames = this.extractFunctionNames(fullCode);
        return functionNames.some(name => {
            // Check if line contains a call to the function (but not the function definition)
            const hasCall = line.includes(name + '(');
            const isDefinition = line.includes('function ' + name) || 
                                line.includes('const ' + name) || 
                                line.includes('let ' + name) ||
                                line.includes('var ' + name) ||
                                line.includes('def ' + name);
            return hasCall && !isDefinition;
        });
    }

    private extractFunctionNames(code: string): string[] {
        const functionPatterns = [
            /function\s+(\w+)/g,
            /const\s+(\w+)\s*=\s*\(/g,
            /let\s+(\w+)\s*=\s*\(/g,
            /var\s+(\w+)\s*=\s*\(/g,
            /(\w+)\s*:\s*function/g,
            /def\s+(\w+)\s*\(/g  // Python
        ];
        
        const names: string[] = [];
        functionPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                names.push(match[1]);
            }
        });
        
        return names;
    }

    private isDataStructureOperation(line: string): boolean {
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

    private isBlockEnd(line: string): boolean {
        return line === 'end' || 
               line === 'fi' || 
               line === 'done' ||
               /^\s*except\s*:/.test(line) ||
               /^\s*finally\s*:/.test(line);
    }

    private hasLargeDataStructures(code: string): boolean {
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

    // Enhanced loop analysis methods
    private analyzeLoopWithVariables(line: string): { isLoop: boolean; variables: string[] } {
        const loopPatterns = [
            { pattern: /\bfor\s*\(\s*let\s+(\w+)\s*=/, variables: 1 },      // for (let i = ...)
            { pattern: /\bfor\s*\(\s*(\w+)\s*=/, variables: 1 },            // for (i = ...)
            { pattern: /\bfor\s*\(\s*let\s+(\w+)\s+of\s+(\w+)/, variables: 2 }, // for (let x of arr)
            { pattern: /\bfor\s*\(\s*let\s+(\w+)\s+in\s+(\w+)/, variables: 2 }, // for (let x in obj)
            { pattern: /\bwhile\s*\(\s*(\w+)/, variables: 1 },              // while (condition)
            { pattern: /\.forEach\s*\(/, variables: 0 },                    // .forEach
            { pattern: /\.map\s*\(/, variables: 0 },                        // .map
            { pattern: /\.filter\s*\(/, variables: 0 },                     // .filter
            { pattern: /\.reduce\s*\(/, variables: 0 }                      // .reduce
        ];

        for (const { pattern, variables } of loopPatterns) {
            const match = pattern.exec(line);
            if (match) {
                const extractedVars: string[] = [];
                for (let i = 1; i <= variables && match[i]; i++) {
                    extractedVars.push(match[i]);
                }
                return { isLoop: true, variables: extractedVars };
            }
        }

        return { isLoop: false, variables: [] };
    }

    private calculateLoopComplexity(nestedLevel: number, loopVariables: string[]): string {
        if (nestedLevel === 1) {
            return 'O(n)';
        }
        
        // Check if we have different variables (indicating different loop bounds)
        const uniqueVariables = [...new Set(loopVariables)];
        
        if (nestedLevel === 2) {
            if (uniqueVariables.length >= 2) {
                // Different variables suggest O(n × m) complexity
                const vars = uniqueVariables.slice(0, 2);
                return `O(${vars.join(' × ')})`;
            } else {
                // Same variable suggests O(n²) complexity
                return 'O(n²)';
            }
        }
        
        if (nestedLevel === 3) {
            if (uniqueVariables.length >= 3) {
                const vars = uniqueVariables.slice(0, 3);
                return `O(${vars.join(' × ')})`;
            } else if (uniqueVariables.length === 2) {
                return `O(n² × m)`;
            } else {
                return 'O(n³)';
            }
        }
        
        // For higher nesting levels, fall back to polynomial notation
        return `O(n^${nestedLevel})`;
    }

    private calculateFinalComplexity(maxNested: number, loopVariables: string[]): { complexity: string; score: number } {
        if (maxNested === 0) {
            return { complexity: '1', score: 1 };
        }
        
        if (maxNested === 1) {
            return { complexity: 'n', score: 2 };
        }
        
        const uniqueVariables = [...new Set(loopVariables)];
        
        if (maxNested === 2) {
            if (uniqueVariables.length >= 2) {
                // Different variables: O(n × m)
                const vars = uniqueVariables.slice(0, 2);
                return { 
                    complexity: `${vars.join(' × ')}`, 
                    score: 4 
                };
            } else {
                // Same variable: O(n²)
                return { complexity: 'n²', score: 4 };
            }
        }
        
        if (maxNested === 3) {
            if (uniqueVariables.length >= 3) {
                const vars = uniqueVariables.slice(0, 3);
                return { 
                    complexity: `${vars.join(' × ')}`, 
                    score: 6 
                };
            } else {
                return { complexity: 'n³', score: 6 };
            }
        }
        
        // Higher nesting levels
        return { 
            complexity: `n^${maxNested}`, 
            score: maxNested * 2 
        };
    }
}

// Language-specific analyzers
class PythonComplexityAnalyzer {
    private details: ComplexityDetails[] = [];

    analyze(code: string): ComplexityResult {
        this.details = [];
        const lines = code.split('\n');
        let timeComplexity = '1';
        let spaceComplexity = '1';
        let totalScore = 1;
        let nestedLevel = 0;
        let maxNested = 0;
        let hasRecursion = false;
        let hasGraphTraversal = false;

        // Check for graph algorithm patterns first
        const analyzer = new ComplexityAnalyzer();
        const graphPatterns = analyzer.detectGraphAlgorithms(code);
        if (graphPatterns.length > 0) {
            hasGraphTraversal = true;
            this.details.push(...graphPatterns);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Check for Python loops
            if (this.isPythonLoop(line)) {
                if (line.startsWith('for ') || line.startsWith('while ')) {
                    nestedLevel++;
                    maxNested = Math.max(maxNested, nestedLevel);
                    this.details.push({
                        type: 'loop',
                        description: `Python ${line.split(' ')[0]} loop detected`,
                        line: lineNumber,
                        complexity: `O(n${nestedLevel > 1 ? '^' + nestedLevel : ''})`
                    });
                }
            }

            // Check for Python recursion
            if (this.isPythonRecursiveCall(line, code)) {
                hasRecursion = true;
                this.details.push({
                    type: 'recursion',
                    description: 'Python recursive call detected',
                    line: lineNumber,
                    complexity: 'O(2^n) or O(n)'
                });
            }

            // Check for Python data structure operations
            if (this.isPythonDataStructureOperation(line)) {
                this.details.push({
                    type: 'data-structure',
                    description: 'Python data structure operation',
                    line: lineNumber,
                    complexity: 'O(1) to O(n)'
                });
            }

            // Handle Python indentation-based nesting
            if (this.isPythonBlockEnd(line, lines, i)) {
                nestedLevel = Math.max(0, nestedLevel - 1);
            }
        }

        // Calculate final complexity based on analysis
        if (hasGraphTraversal) {
            timeComplexity = 'V + E';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (hasRecursion) {
            timeComplexity = '2^n';
            spaceComplexity = 'n';
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

        // Analyze space complexity for Python
        if (hasGraphTraversal) {
            spaceComplexity = 'V';
        } else if (hasRecursion) {
            spaceComplexity = 'n';
        } else if (this.hasPythonLargeDataStructures(code)) {
            spaceComplexity = 'n';
        }

        return {
            timeComplexity,
            spaceComplexity,
            details: this.details,
            totalScore
        };
    }

    private isPythonLoop(line: string): boolean {
        const pythonLoopPatterns = [
            /^\s*for\s+\w+\s+in\s+/,
            /^\s*while\s+.+:/,
            /\.map\s*\(/,
            /\.filter\s*\(/,
            /list\s*\(/,
            /\[.*for\s+.*in\s+.*\]/  // List comprehension
        ];
        return pythonLoopPatterns.some(pattern => pattern.test(line));
    }

    private isPythonRecursiveCall(line: string, fullCode: string): boolean {
        const functionNames = this.extractPythonFunctionNames(fullCode);
        return functionNames.some(name => {
            const hasCall = line.includes(name + '(');
            const isDefinition = line.includes('def ' + name);
            return hasCall && !isDefinition;
        });
    }

    private extractPythonFunctionNames(code: string): string[] {
        const functionPattern = /def\s+(\w+)\s*\(/g;
        const names: string[] = [];
        let match;
        while ((match = functionPattern.exec(code)) !== null) {
            names.push(match[1]);
        }
        return names;
    }

    private isPythonDataStructureOperation(line: string): boolean {
        const patterns = [
            /\.append\s*\(/,
            /\.insert\s*\(/,
            /\.remove\s*\(/,
            /\.pop\s*\(/,
            /\.sort\s*\(/,
            /\.index\s*\(/,
            /sorted\s*\(/,
            /list\s*\(/,
            /dict\s*\(/,
            /set\s*\(/,
            /collections\./
        ];
        return patterns.some(pattern => pattern.test(line));
    }

    private isPythonBlockEnd(line: string, lines: string[], index: number): boolean {
        if (index >= lines.length - 1) return false;
        
        const currentIndent = this.getPythonIndentation(line);
        const nextIndent = this.getPythonIndentation(lines[index + 1] || '');
        
        return nextIndent < currentIndent;
    }

    private getPythonIndentation(line: string): number {
        const match = line.match(/^(\s*)/);
        return match ? match[1].length : 0;
    }

    private hasPythonLargeDataStructures(code: string): boolean {
        const patterns = [
            /list\s*\([^)]{20,}\)/,
            /dict\s*\([^)]{20,}\)/,
            /set\s*\([^)]{20,}\)/,
            /\[[^\]]{20,}\]/,
            /\{[^}]{20,}\}/
        ];
        return patterns.some(pattern => pattern.test(code));
    }
}

class JavaComplexityAnalyzer {
    private details: ComplexityDetails[] = [];

    analyze(code: string): ComplexityResult {
        this.details = [];
        const lines = code.split('\n');
        let timeComplexity = '1';
        let spaceComplexity = '1';
        let totalScore = 1;
        let nestedLevel = 0;
        let maxNested = 0;
        let hasRecursion = false;
        let hasGraphTraversal = false;

        // Check for graph algorithm patterns first
        const analyzer = new ComplexityAnalyzer();
        const graphPatterns = analyzer.detectGraphAlgorithms(code);
        if (graphPatterns.length > 0) {
            hasGraphTraversal = true;
            this.details.push(...graphPatterns);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Check for Java loops
            if (this.isJavaLoop(line)) {
                nestedLevel++;
                maxNested = Math.max(maxNested, nestedLevel);
                this.details.push({
                    type: 'loop',
                    description: this.getJavaLoopType(line),
                    line: lineNumber,
                    complexity: `O(n${nestedLevel > 1 ? '^' + nestedLevel : ''})`
                });
            }

            // Check for Java recursion
            if (this.isJavaRecursiveCall(line, code)) {
                hasRecursion = true;
                this.details.push({
                    type: 'recursion',
                    description: 'Java recursive call detected',
                    line: lineNumber,
                    complexity: 'O(2^n) or O(n)'
                });
            }

            // Check for Java data structure operations
            if (this.isJavaDataStructureOperation(line)) {
                this.details.push({
                    type: 'data-structure',
                    description: 'Java collection operation',
                    line: lineNumber,
                    complexity: 'O(1) to O(n)'
                });
            }

            // Handle Java block endings
            if (line.includes('}')) {
                nestedLevel = Math.max(0, nestedLevel - 1);
            }
        }

        // Calculate final complexity
        if (hasGraphTraversal) {
            timeComplexity = 'V + E';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (hasRecursion) {
            timeComplexity = '2^n';
            spaceComplexity = 'n';
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

        // Analyze space complexity for Java
        if (hasGraphTraversal) {
            spaceComplexity = 'V';
        } else if (hasRecursion) {
            spaceComplexity = 'n';
        } else if (this.hasJavaLargeDataStructures(code)) {
            spaceComplexity = 'n';
        }

        return {
            timeComplexity,
            spaceComplexity,
            details: this.details,
            totalScore
        };
    }

    private isJavaLoop(line: string): boolean {
        const javaLoopPatterns = [
            /\bfor\s*\(/,
            /\bwhile\s*\(/,
            /\bdo\s*\{/,
            /\bfor\s*\(\s*\w+.*:\s*\w+\s*\)/, // Enhanced for loop
            /\.forEach\s*\(/,
            /\.stream\s*\(\)/
        ];
        return javaLoopPatterns.some(pattern => pattern.test(line));
    }

    private getJavaLoopType(line: string): string {
        if (line.includes('for (')) return 'Java for loop detected';
        if (line.includes('while (')) return 'Java while loop detected';
        if (line.includes('do {')) return 'Java do-while loop detected';
        if (line.includes(':')) return 'Java enhanced for loop detected';
        if (line.includes('.forEach')) return 'Java stream forEach detected';
        if (line.includes('.stream')) return 'Java stream operation detected';
        return 'Java loop detected';
    }

    private isJavaRecursiveCall(line: string, fullCode: string): boolean {
        const methodNames = this.extractJavaMethodNames(fullCode);
        return methodNames.some(name => {
            const hasCall = line.includes(name + '(');
            const isDefinition = line.includes('public ') || line.includes('private ') || line.includes('protected ');
            return hasCall && !isDefinition;
        });
    }

    private extractJavaMethodNames(code: string): string[] {
        const methodPattern = /(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(/g;
        const names: string[] = [];
        let match;
        while ((match = methodPattern.exec(code)) !== null) {
            names.push(match[1]);
        }
        return names;
    }

    private isJavaDataStructureOperation(line: string): boolean {
        const patterns = [
            /\.add\s*\(/,
            /\.remove\s*\(/,
            /\.get\s*\(/,
            /\.put\s*\(/,
            /\.contains\s*\(/,
            /\.indexOf\s*\(/,
            /\.sort\s*\(/,
            /Collections\./,
            /Arrays\./,
            /new\s+(ArrayList|LinkedList|HashMap|TreeMap|HashSet|TreeSet)/,
            /\.stream\s*\(\)/,
            /\.collect\s*\(/
        ];
        return patterns.some(pattern => pattern.test(line));
    }

    private hasJavaLargeDataStructures(code: string): boolean {
        const patterns = [
            /new\s+\w+\[\s*\w+\s*\]/,  // Array allocation
            /new\s+(ArrayList|LinkedList|HashMap|TreeMap|HashSet|TreeSet)\s*\(/,
            /\{\s*.{20,}\s*\}/,  // Large initialization blocks
        ];
        return patterns.some(pattern => pattern.test(code));
    }
}

class CComplexityAnalyzer {
    private details: ComplexityDetails[] = [];

    analyze(code: string): ComplexityResult {
        this.details = [];
        const lines = code.split('\n');
        let timeComplexity = '1';
        let spaceComplexity = '1';
        let totalScore = 1;
        let nestedLevel = 0;
        let maxNested = 0;
        let hasRecursion = false;
        let hasGraphTraversal = false;

        // Check for graph algorithm patterns first
        const analyzer = new ComplexityAnalyzer();
        const graphPatterns = analyzer.detectGraphAlgorithms(code);
        if (graphPatterns.length > 0) {
            hasGraphTraversal = true;
            this.details.push(...graphPatterns);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Check for C loops
            if (this.isCLoop(line)) {
                nestedLevel++;
                maxNested = Math.max(maxNested, nestedLevel);
                this.details.push({
                    type: 'loop',
                    description: this.getCLoopType(line),
                    line: lineNumber,
                    complexity: `O(n${nestedLevel > 1 ? '^' + nestedLevel : ''})`
                });
            }

            // Check for C recursion
            if (this.isCRecursiveCall(line, code)) {
                hasRecursion = true;
                this.details.push({
                    type: 'recursion',
                    description: 'C recursive call detected',
                    line: lineNumber,
                    complexity: 'O(2^n) or O(n)'
                });
            }

            // Check for C data structure operations
            if (this.isCDataStructureOperation(line)) {
                this.details.push({
                    type: 'data-structure',
                    description: 'C memory/array operation',
                    line: lineNumber,
                    complexity: 'O(1) to O(n)'
                });
            }

            // Handle C block endings
            if (line.includes('}')) {
                nestedLevel = Math.max(0, nestedLevel - 1);
            }
        }

        // Calculate final complexity
        if (hasGraphTraversal) {
            timeComplexity = 'V + E';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (hasRecursion) {
            timeComplexity = '2^n';
            spaceComplexity = 'n';
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

        // Analyze space complexity for C
        if (hasGraphTraversal) {
            spaceComplexity = 'V';
        } else if (hasRecursion) {
            spaceComplexity = 'n';
        } else if (this.hasCLargeDataStructures(code)) {
            spaceComplexity = 'n';
        }

        return {
            timeComplexity,
            spaceComplexity,
            details: this.details,
            totalScore
        };
    }

    private isCLoop(line: string): boolean {
        const cLoopPatterns = [
            /\bfor\s*\(/,
            /\bwhile\s*\(/,
            /\bdo\s*\{/
        ];
        return cLoopPatterns.some(pattern => pattern.test(line));
    }

    private getCLoopType(line: string): string {
        if (line.includes('for (')) return 'C for loop detected';
        if (line.includes('while (')) return 'C while loop detected';
        if (line.includes('do {')) return 'C do-while loop detected';
        return 'C loop detected';
    }

    private isCRecursiveCall(line: string, fullCode: string): boolean {
        const functionNames = this.extractCFunctionNames(fullCode);
        return functionNames.some(name => {
            const hasCall = line.includes(name + '(');
            const isDefinition = line.includes(name + '(') && 
                                (line.includes('int ') || line.includes('void ') || 
                                 line.includes('char ') || line.includes('float ') || 
                                 line.includes('double '));
            return hasCall && !isDefinition;
        });
    }

    private extractCFunctionNames(code: string): string[] {
        const functionPattern = /(?:int|void|char|float|double|\w+)\s+(\w+)\s*\(/g;
        const names: string[] = [];
        let match;
        while ((match = functionPattern.exec(code)) !== null) {
            // Exclude common C keywords and library functions
            if (!['if', 'while', 'for', 'switch', 'printf', 'scanf', 'malloc', 'free'].includes(match[1])) {
                names.push(match[1]);
            }
        }
        return names;
    }

    private isCDataStructureOperation(line: string): boolean {
        const patterns = [
            /malloc\s*\(/,
            /calloc\s*\(/,
            /realloc\s*\(/,
            /free\s*\(/,
            /\[\s*\w+\s*\]/,  // Array access
            /\*\w+/,  // Pointer dereference
            /&\w+/,   // Address of
            /memcpy\s*\(/,
            /memset\s*\(/,
            /strlen\s*\(/,
            /strcpy\s*\(/,
            /strcat\s*\(/
        ];
        return patterns.some(pattern => pattern.test(line));
    }

    private hasCLargeDataStructures(code: string): boolean {
        const patterns = [
            /malloc\s*\(\s*\w+\s*\*\s*sizeof/,
            /\w+\s+\w+\[\s*\w+\s*\]/,  // Array declarations
            /struct\s+\w+/,
            /typedef\s+struct/
        ];
        return patterns.some(pattern => pattern.test(code));
    }
}

class JSComplexityAnalyzer {
    private details: ComplexityDetails[] = [];
    private nestedLevel = 0;
    private maxNested = 0;
    private hasRecursion = false;
    private codeLines: string[] = [];
    private loopVariables: string[] = []; // Track current loop variables (stack)
    private allLoopVariables: string[] = []; // Track all loop variables seen

    analyze(ast: Node, code: string): ComplexityResult {
        this.codeLines = code.split('\n');
        this.details = [];
        this.nestedLevel = 0;
        this.maxNested = 0;
        this.hasRecursion = false;
        this.loopVariables = [];
        this.allLoopVariables = []; // Reset all variables tracker

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
            timeComplexity = 'V + E';
            spaceComplexity = 'V';
            totalScore = 6;
        } else if (this.hasRecursion) {
            timeComplexity = '2^n';
            totalScore = 8;
            spaceComplexity = 'n';
        } else {
            // Use enhanced complexity calculation with variable awareness
            console.log('[JSComplexityAnalyzer DEBUG] Calling calculateFinalComplexity with:', { maxNested: this.maxNested, allLoopVariables: this.allLoopVariables });
            const complexityResult = this.calculateFinalComplexity(this.maxNested, this.allLoopVariables);
            console.log('[JSComplexityAnalyzer DEBUG] Got result:', complexityResult);
            timeComplexity = complexityResult.complexity;
            totalScore = complexityResult.score;
        }

        return {
            timeComplexity,
            spaceComplexity,
            details: this.details,
            totalScore
        };
    }

    private visit(node: any): void {
        if (!node) return;

        const isLoop = ['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForInStatement', 'ForOfStatement'].includes(node.type);
        let variableAdded = false;

        if (isLoop) {
            this.nestedLevel++;
            this.maxNested = Math.max(this.maxNested, this.nestedLevel);
            
            const line = node.loc?.start?.line || 1;
            
            // Extract variable name from AST node
            const variableName = this.extractVariableFromNode(node);
            if (variableName) {
                this.loopVariables.push(variableName);
                this.allLoopVariables.push(variableName); // Track all variables
                variableAdded = true;
            }

            this.details.push({
                type: 'loop',
                description: `${node.type} detected${variableName ? ` (variable: ${variableName})` : ''}`,
                line,
                complexity: this.calculateLoopComplexity(this.nestedLevel, this.loopVariables)
            });
        } else if (node.type === 'CallExpression') {
            this.handleCallExpression(node);
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

        // Clean up when exiting loop
        if (isLoop) {
            this.nestedLevel--;
            if (variableAdded) {
                this.loopVariables.pop();
            }
        }
    }



    private extractVariableFromNode(node: any): string | null {
        switch (node.type) {
            case 'ForStatement':
                // for (let i = 0; i < n; i++)
                if (node.init?.declarations?.[0]?.id?.name) {
                    return node.init.declarations[0].id.name;
                }
                break;
            case 'ForInStatement':
            case 'ForOfStatement':
                // for (let x in/of array)
                if (node.left?.declarations?.[0]?.id?.name) {
                    return node.left.declarations[0].id.name;
                } else if (node.left?.id?.name) {
                    return node.left.id.name;
                }
                break;
            case 'WhileStatement':
                // Extract variable from condition if possible
                return this.extractVariableFromCondition(node.test);
        }
        return null;
    }

    private extractVariableFromCondition(condition: any): string | null {
        if (condition?.left?.name) {
            return condition.left.name;
        }
        if (condition?.object?.name) {
            return condition.object.name;
        }
        return null;
    }

    private calculateLoopComplexity(nestedLevel: number, loopVariables: string[]): string {
        if (nestedLevel === 1) {
            return 'O(n)';
        }
        
        // Check if we have different variables (indicating different loop bounds)
        const uniqueVariables = [...new Set(loopVariables)];
        
        if (nestedLevel === 2) {
            if (uniqueVariables.length >= 2) {
                // Different variables suggest O(n × m) complexity
                const vars = uniqueVariables.slice(0, 2);
                return `O(${vars.join(' × ')})`;
            } else {
                // Same variable suggests O(n²) complexity
                return 'O(n²)';
            }
        }
        
        if (nestedLevel === 3) {
            if (uniqueVariables.length >= 3) {
                const vars = uniqueVariables.slice(0, 3);
                return `O(${vars.join(' × ')})`;
            } else if (uniqueVariables.length === 2) {
                return `O(n² × m)`;
            } else {
                return 'O(n³)';
            }
        }
        
        // For higher nesting levels, fall back to polynomial notation
        return `O(n^${nestedLevel})`;
    }

    private calculateFinalComplexity(maxNested: number, loopVariables: string[]): { complexity: string; score: number } {
        if (maxNested === 0) {
            return { complexity: '1', score: 1 };
        }
        
        if (maxNested === 1) {
            return { complexity: 'n', score: 2 };
        }
        
        const uniqueVariables = [...new Set(loopVariables)];
        
        if (maxNested === 2) {
            if (uniqueVariables.length >= 2) {
                // Different variables: O(n × m)
                const vars = uniqueVariables.slice(0, 2);
                return { 
                    complexity: `${vars.join(' × ')}`, 
                    score: 4 
                };
            } else {
                // Same variable: O(n²)
                return { complexity: 'n²', score: 4 };
            }
        }
        
        if (maxNested === 3) {
            if (uniqueVariables.length >= 3) {
                const vars = uniqueVariables.slice(0, 3);
                return { 
                    complexity: `${vars.join(' × ')}`, 
                    score: 6 
                };
            } else {
                return { complexity: 'n³', score: 6 };
            }
        }
        
        // Higher nesting levels
        return { 
            complexity: `n^${maxNested}`, 
            score: maxNested * 2 
        };
    }

    private handleCallExpression(node: any): void {
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
