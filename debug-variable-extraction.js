// Debug script to test variable extraction for nested loops
const acorn = require('acorn');

// Test code from the user
const testCode = `function nestedLoops(n, m) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            console.log(i, j);
        }
    }
}`;

console.log('Testing nestedLoops function:');
console.log('Code:', testCode);
console.log('');

try {
    const ast = acorn.parse(testCode, {
        ecmaVersion: 2020,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true
    });

    console.log('AST parsed successfully');
    
    // Simple analyzer to test variable extraction
    class SimpleJSAnalyzer {
        constructor() {
            this.loopVariables = [];
            this.nestedLevel = 0;
            this.maxNested = 0;
        }

        analyze(ast) {
            this.visit(ast);
            console.log('Final loop variables:', this.loopVariables);
            console.log('Max nested level:', this.maxNested);
            
            const uniqueVariables = [...new Set(this.loopVariables)];
            console.log('Unique variables:', uniqueVariables);
            
            if (this.maxNested === 2 && uniqueVariables.length >= 2) {
                const vars = uniqueVariables.slice(0, 2);
                const complexity = `${vars.join(' × ')}`;
                console.log('Expected complexity: O(' + complexity + ')');
                return 'O(' + complexity + ')';
            } else if (this.maxNested === 2) {
                console.log('Expected complexity: O(n²)');
                return 'O(n²)';
            }
            
            return 'O(1)';
        }

        visit(node) {
            if (!node) return;

            const isLoop = ['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForInStatement', 'ForOfStatement'].includes(node.type);
            let variableAdded = false;

            if (isLoop) {
                this.nestedLevel++;
                this.maxNested = Math.max(this.maxNested, this.nestedLevel);
                
                console.log(`Entering loop at level ${this.nestedLevel}, type: ${node.type}`);
                
                // Extract variable name from AST node
                const variableName = this.extractVariableFromNode(node);
                if (variableName) {
                    this.loopVariables.push(variableName);
                    variableAdded = true;
                    console.log(`  Added variable: ${variableName}, current variables: [${this.loopVariables.join(', ')}]`);
                }
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
                console.log(`Exiting loop at level ${this.nestedLevel}`);
                this.nestedLevel--;
                if (variableAdded) {
                    const removed = this.loopVariables.pop();
                    console.log(`  Removed variable: ${removed}, remaining variables: [${this.loopVariables.join(', ')}]`);
                }
            }
        }

        extractVariableFromNode(node) {
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

        extractVariableFromCondition(condition) {
            if (condition?.left?.name) {
                return condition.left.name;
            }
            if (condition?.object?.name) {
                return condition.object.name;
            }
            return null;
        }
    }
    
    const analyzer = new SimpleJSAnalyzer();
    const result = analyzer.analyze(ast);
    
    console.log('');
    console.log('Final result:', result);
    console.log('This should show O(i × j) which represents O(n × m)');
    
} catch (error) {
    console.error('Error:', error);
}
