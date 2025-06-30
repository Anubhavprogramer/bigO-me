// Sample JavaScript file to test the Code Complexity Analyzer extension

// O(1) - Constant time complexity
function constantTimeFunction(n) {
    return n * 2;
}

// O(n) - Linear time complexity
function linearTimeFunction(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// O(n²) - Quadratic time complexity
function quadraticTimeFunction(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            result.push(arr[i] + arr[j]);
        }
    }
    return result;
}

// O(2^n) - Exponential time complexity (recursive)
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// O(n log n) - Using built-in sort
function sortArray(arr) {
    return arr.sort((a, b) => a - b);
}

// Complex nested function
function complexFunction(matrix) {
    const visited = new Set();
    let result = 0;
    
    // Nested loops with data structure operations
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (!visited.has(`${i},${j}`)) {
                visited.add(`${i},${j}`);
                result += matrix[i][j];
                
                // Inner loop adds more complexity
                for (let k = 0; k < matrix[i][j]; k++) {
                    result += k;
                }
            }
        }
    }
    
    return result;
}

// Function using array methods
function arrayMethodsExample(data) {
    return data
        .filter(item => item > 0)           // O(n)
        .map(item => item * 2)              // O(n)
        .reduce((sum, item) => sum + item, 0); // O(n)
    // Overall: O(n)
}

// Recursive function with memoization (better complexity)
const memoFib = (() => {
    const cache = {};
    return function fib(n) {
        if (n in cache) return cache[n];
        if (n <= 1) return n;
        cache[n] = fib(n - 1) + fib(n - 2);
        return cache[n];
    };
})();

console.log('Test the Code Complexity Analyzer extension on these functions!');
