// Test demonstrating the enhanced complexity analysis

// Test case 1: Different loop variables (n × m)
function nestedLoops(n, m) {
    for (let i = 0; i < n; i++) {        // Variable: i (bound by n)
        for (let j = 0; j < m; j++) {    // Variable: j (bound by m)
            console.log(i, j);
        }
    }
}
// Expected: O(i × j) which represents O(n × m)

// Test case 2: Same loop variable (n²)
function squareMatrix(n) {
    for (let i = 0; i < n; i++) {        // Variable: i (bound by n)
        for (let k = 0; k < n; k++) {    // Variable: k (also bound by n)
            console.log(i, k);
        }
    }
}
// Expected: O(n²) since both loops depend on the same parameter

// Test case 3: Triple nested with different variables
function tripleLoop(x, y, z) {
    for (let a = 0; a < x; a++) {        // Variable: a (bound by x)
        for (let b = 0; b < y; b++) {    // Variable: b (bound by y)
            for (let c = 0; c < z; c++) { // Variable: c (bound by z)
                console.log(a, b, c);
            }
        }
    }
}
// Expected: O(a × b × c) which represents O(x × y × z)

// Test case 4: Mixed complexity
function matrixMultiply(A, B) {
    const n = A.length;
    const m = B[0].length;
    const p = B.length;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < p; k++) {
                // Matrix multiplication logic
            }
        }
    }
}
// Expected: O(i × j × k) representing O(n × m × p)
