# Code Complexity Analyzer - Multi-Language Support

## Overview
The Code Complexity Analyzer VS Code extension now supports comprehensive complexity analysis across multiple programming languages including JavaScript, TypeScript, Python, Java, and C/C++.

## Supported Languages

### 1. JavaScript & TypeScript
- **AST-based analysis** using Acorn parser
- **Features**: Loop detection, recursion analysis, array operations, graph algorithms
- **Patterns**: for/while loops, arrow functions, array methods (map, filter, reduce)

### 2. Python  
- **Pattern-based analysis** with Python-specific syntax recognition
- **Features**: for/while loops, list comprehensions, recursion, BFS/DFS detection
- **Patterns**: `for x in range()`, `while condition:`, `def function()`, `deque`, `collections`

### 3. Java
- **Object-oriented complexity analysis** 
- **Features**: for/while/enhanced-for loops, method recursion, collection operations
- **Patterns**: `for (int i...)`, `while (...)`, `Queue<>`, `ArrayList`, `HashMap`, stream operations

### 4. C/C++
- **Low-level complexity analysis**
- **Features**: for/while loops, function recursion, pointer operations, memory allocation
- **Patterns**: `for (int i...)`, `malloc()`, array access, struct operations

## Algorithm Detection

### Graph Algorithms (O(V + E))
All languages support detection of:
- **Breadth-First Search (BFS)**: Queue-based traversal
- **Depth-First Search (DFS)**: Stack/recursion-based traversal  
- **DAG Algorithms**: Topological sorting, longest path

**Detection Heuristics:**
- Adjacency list/graph data structures
- Queue usage (BFS indicator) 
- Visited arrays/sets
- Graph terminology in variable names

### Common Complexity Patterns

#### Time Complexity
- **O(1)**: Constant operations
- **O(n)**: Single loops, linear search
- **O(n²)**: Nested loops, bubble sort
- **O(n³)**: Triple nested loops, matrix operations  
- **O(2^n)**: Recursive algorithms (Fibonacci)
- **O(V + E)**: Graph traversal algorithms

#### Space Complexity  
- **O(1)**: No additional data structures
- **O(n)**: Arrays, recursion stack
- **O(V)**: Graph algorithms with visited tracking

## Language-Specific Features

### Python Enhancements
```python
# Detects O(n²) nested loops
for i in range(len(arr)):
    for j in range(len(arr)-1):
        # ...

# Detects O(2^n) recursion  
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)

# Detects O(V + E) graph traversal
def bfs(graph, start):
    queue = deque([start])
    visited = set()
    # ...
```

### Java Enhancements
```java
// Detects O(n²) nested loops
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // ...
    }
}

// Detects O(2^n) recursion
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// Detects O(V + E) with collections
Queue<Integer> queue = new LinkedList<>();
Set<Integer> visited = new HashSet<>();
```

### C/C++ Enhancements
```c
// Detects O(n²) nested loops
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // ...
    }
}

// Detects O(2^n) recursion
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// Detects memory allocation patterns
int* arr = malloc(n * sizeof(int));
```

## Usage

### Command Palette
- `Analyze Time & Space Complexity`: Analyze selected code
- `Show Complexity Report`: Display detailed analysis report

### Automatic Analysis  
Enable auto-analysis on file save in settings:
```json
{
    "complexityAnalyzer.enableAutoAnalysis": true,
    "complexityAnalyzer.showInlineAnnotations": true
}
```

### Context Menu
Right-click selected code → "Analyze Time & Space Complexity"

## Test Files Included

- `test-python.py`: Python complexity examples
- `test-java.java`: Java complexity examples  
- `test-c.c`: C complexity examples
- `test-multi-language-standalone.js`: Comprehensive test suite

## Technical Implementation

### Architecture
- **Main Analyzer**: Routes to language-specific analyzers
- **Language-Specific Classes**: 
  - `PythonComplexityAnalyzer`
  - `JavaComplexityAnalyzer` 
  - `CComplexityAnalyzer`
  - `JSComplexityAnalyzer` (with AST parsing)

### Pattern Matching
Each language analyzer uses:
- **Regex patterns** for syntax recognition
- **Heuristic detection** for algorithm patterns
- **Context-aware analysis** for accurate results

### Graph Algorithm Detection
Unified detection across all languages using:
- Keyword analysis (bfs, dfs, graph, adjacency)
- Data structure patterns (queue, stack, visited)
- Algorithm flow recognition (topological sort, traversal)

## Examples

### Multi-Language Graph BFS Detection

**Python:**
```python
def bfs(graph, start):
    visited = set()
    queue = deque([start])  # ← Detected: O(V + E)
```

**Java:**
```java
public void bfs(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new LinkedList<>();  // ← Detected: O(V + E)
    Set<Integer> visited = new HashSet<>();
```

**C:**
```c
void bfs(int graph[][100], int vertices, int start) {
    struct Queue q = {0};  // ← Detected: O(V + E)
    int visited[100] = {0};
```

All three implementations are correctly identified as O(V + E) graph algorithms!

## Configuration

```json
{
    "complexityAnalyzer.enableAutoAnalysis": false,
    "complexityAnalyzer.showInlineAnnotations": true
}
```

## Future Enhancements
- Additional language support (Go, Rust, PHP)
- More sophisticated AST parsing for all languages
- Machine learning-based pattern recognition
- Performance profiling integration
