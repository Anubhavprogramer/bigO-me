# Testing the Code Complexity Analyzer Extension

## Installation

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
3. Type "Extensions: Install from VSIX..."
4. Select the `code-complexity-analyzer-0.0.1.vsix` file
5. Restart VS Code when prompted

## Features to Test

### 1. Basic Complexity Analysis
- Open `test.js` or `test-examples.js`
- Press `F5` to start a new Extension Development Host
- In the new window, open a JavaScript/TypeScript file
- Use `Ctrl+Shift+P` → "Analyze Code Complexity" to see the analysis

### 2. Graph Algorithm Detection (NEW!)
- Open `test-graph-algorithms.js`
- Run the complexity analysis on different functions
- **Expected Results:**
  - `bfs()`: Should show **O(E + V)** time complexity
  - `dfs()`: Should show **O(E + V)** time complexity  
  - `traverseGraph()`: Should show **O(E + V)** time complexity
  - `findPath()`: Should show **O(E + V)** time complexity

### 3. Auto-Hide Feature (FIXED!)
- Run complexity analysis on any function
- **Expected Behavior:** Complexity annotations should automatically disappear after 5 seconds
- The decorations should fade out without manual intervention

### 4. Inline Annotations
- Enable inline annotations in settings: `"complexityAnalyzer.showInlineAnnotations": true`
- Save a file with function definitions
- Should see inline complexity annotations next to function signatures

### 5. Webview Reports
- Use command "Show Complexity Report" to open detailed analysis
- Should show breakdown of complexity details

## Test Files Included

- `test.js` - Basic complexity examples
- `test-examples.js` - More complex nested loops
- `test-graph-algorithms.js` - Graph traversal algorithms (NEW!)

## What's New in This Version

### Graph Algorithm Detection
The extension now detects common graph traversal patterns and correctly identifies them as **O(E + V)** complexity:

- **BFS (Breadth-First Search)**: Detects queue usage with graph traversal
- **DFS (Depth-First Search)**: Detects recursive or stack-based graph traversal  
- **General Graph Traversal**: Detects adjacency lists, visited arrays, and traversal patterns

### Auto-Hide Fixed
- Complexity annotations now properly disappear after 5 seconds
- No more persistent annotations cluttering the editor
- Periodic cleanup ensures expired decorations are removed

## Testing Graph Complexity Detection

Use the `test-graph-algorithms.js` file to verify:

```javascript
// This should show O(E + V) complexity
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    // ... BFS implementation
}
```

The analyzer should detect:
- Keywords: `bfs`, `dfs`, `graph`, `adjacency`, `visited`, `queue`, `edges`
- Patterns: Queue/stack usage with graph structures
- Result: **Time: O(E + V), Space: O(V)**

## Quick Testing Steps

### For Graph Algorithm Detection:
1. Open `test-graph-algorithms.js`
2. Place cursor in any function (bfs, dfs, traverseGraph, findPath)
3. Run complexity analysis
4. Verify output shows **O(E + V)** instead of O(n²)

### For Auto-Hide Feature:
1. Run analysis on any function
2. Wait 5 seconds
3. Verify annotations disappear automatically
4. No manual intervention needed

## Troubleshooting

If the extension isn't working:
1. Check the Developer Console (`Help > Toggle Developer Tools`) for errors
2. Make sure you're testing in the Extension Development Host (F5)
3. Try reloading the window (`Ctrl+R` or `Cmd+R`)

Happy testing! 🎉
