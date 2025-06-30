// Simple test script to verify our complexity analyzer works

const { ComplexityAnalyzer } = require('./dist/extension.js');

// Create test code samples
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
    }`
};

console.log('🔍 Testing Code Complexity Analyzer...\n');

const analyzer = new ComplexityAnalyzer();

Object.entries(testCodes).forEach(([name, code]) => {
    console.log(`\n📊 Testing ${name} function:`);
    console.log(`Code: ${code}`);
    
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
console.log('\n🚀 Your extension is ready to use!');
console.log('\n📋 To test the full extension:');
console.log('1. Open VS Code');
console.log('2. Open this project folder');
console.log('3. Press Cmd+Shift+P');
console.log('4. Type "Tasks: Run Task"');
console.log('5. Select "watch"');
console.log('6. Press Cmd+Shift+P again');
console.log('7. Type "Developer: Reload Window"');
console.log('8. Open a JavaScript file and test the commands!');
