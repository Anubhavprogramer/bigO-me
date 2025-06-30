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
        // Basic Python complexity analysis using pattern matching
        return this.analyzeGeneric(code);
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
        if (hasRecursion) {
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
        if (hasRecursion) {
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
        return functionNames.some(name => 
            line.includes(name + '(') && !line.includes('function ' + name)
        );
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
}

class JSComplexityAnalyzer {
    private details: ComplexityDetails[] = [];
    private nestedLevel = 0;
    private maxNested = 0;
    private hasRecursion = false;
    private codeLines: string[] = [];

    analyze(ast: Node, code: string): ComplexityResult {
        this.codeLines = code.split('\n');
        this.details = [];
        this.nestedLevel = 0;
        this.maxNested = 0;
        this.hasRecursion = false;

        this.visit(ast);

        let timeComplexity = '1';
        let spaceComplexity = '1';
        let totalScore = 1;

        if (this.hasRecursion) {
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

    private visit(node: any): void {
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

    private handleLoop(node: any): void {
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
