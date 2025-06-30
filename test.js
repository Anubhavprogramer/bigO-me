// Test file for the Code Complexity Analyzer extension

// Simple function - O(1)
function simpleFunction(x) {
    return x + 1;
}

// Loop function - O(n)
function loopFunction(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

// Nested loops - O(n²)
function nestedLoops(n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            console.log(i, j);
        }
    }
}
