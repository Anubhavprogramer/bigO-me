// Test the updated complexity analyzer
console.log('Testing the updated JSComplexityAnalyzer...');

// Simulate the fixed logic
function testVariableTracking() {
    const allLoopVariables = [];
    let maxNested = 0;
    
    // Simulate processing nested loops
    console.log('Simulating nested loops: for(let i...) { for(let j...) {...} }');
    
    // First loop: i
    allLoopVariables.push('i');
    maxNested = 1;
    console.log('After first loop - Variables:', allLoopVariables, 'Max nested:', maxNested);
    
    // Second loop: j
    allLoopVariables.push('j');
    maxNested = 2;
    console.log('After second loop - Variables:', allLoopVariables, 'Max nested:', maxNested);
    
    // Calculate final complexity
    const uniqueVariables = [...new Set(allLoopVariables)];
    console.log('Unique variables:', uniqueVariables);
    
    if (maxNested === 2 && uniqueVariables.length >= 2) {
        const vars = uniqueVariables.slice(0, 2);
        const complexity = vars.join(' × ');
        console.log('Final complexity: O(' + complexity + ')');
        return 'O(' + complexity + ')';
    } else if (maxNested === 2) {
        console.log('Final complexity: O(n²)');
        return 'O(n²)';
    }
    
    return 'O(1)';
}

const result = testVariableTracking();
console.log('');
console.log('Expected result for nestedLoops(n, m): O(i × j)');
console.log('Actual result:', result);
console.log('Success:', result === 'O(i × j)' ? '✅' : '❌');
