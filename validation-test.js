// Validation test for the complexity analyzer fix
// This file should show O(i × j) complexity for the nestedLoops function

function nestedLoops(n, m) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            console.log(i, j);
        }
    }
}
// Expected: O(i × j) which represents O(n × m)

function sameVariableLoops(n) {
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < n; k++) {
            console.log(i, k);
        }
    }
}
// Expected: O(n²) since both loops use the same bound n

function tripleNestedDifferentVars(a, b, c) {
    for (let x = 0; x < a; x++) {
        for (let y = 0; y < b; y++) {
            for (let z = 0; z < c; z++) {
                console.log(x, y, z);
            }
        }
    }
}
// Expected: O(x × y × z) which represents O(a × b × c)
