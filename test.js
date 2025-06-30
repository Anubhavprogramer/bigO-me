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

// Recursive function - O(2^n)
function recursiveFunction(n) {
    if (n <= 1) return n;
    return recursiveFunction(n - 1) + recursiveFunction(n - 2);
}

// Array methods - O(n log n)
function arrayMethodsExample(arr) {
    return arr.sort((a, b) => a - b);
}

// Complex nested function - O(n²)



// Function using array methods - O(n)
function arrayMethodsExample(data) {
    return data
        .filter(item => item > 0)           // O(n)
        .map(item => item * 2)              // O(n)
        .reduce((sum, item) => sum + item, 0); // O(n)
    // Overall: O(n)
}


