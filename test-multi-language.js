const { ComplexityAnalyzer } = require('./src/complexityAnalyzer.ts');

// Test the multi-language analyzer
const analyzer = new ComplexityAnalyzer();

console.log('=== Multi-Language Complexity Analyzer Test ===\n');

// Test JavaScript/TypeScript
const jsCode = `
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}

function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const node = queue.shift();
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}
`;

// Test Python
const pythonCode = `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
`;

// Test Java
const javaCode = `
public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

public void bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    
    queue.offer(start);
    visited.add(start);
    
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
}

public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
`;

// Test C
const cCode = `
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

void bfs(int graph[][100], int vertices, int start) {
    int visited[100] = {0};
    struct Queue q = {0};
    
    visited[start] = 1;
    enqueue(&q, start);
    
    while (!isEmpty(&q)) {
        int node = dequeue(&q);
        for (int i = 0; i < vertices; i++) {
            if (graph[node][i] && !visited[i]) {
                visited[i] = 1;
                enqueue(&q, i);
            }
        }
    }
}

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
`;

// Run tests
console.log('1. JavaScript Analysis:');
const jsResult = analyzer.analyzeCode(jsCode, 'javascript');
console.log('Time Complexity:', jsResult.timeComplexity);
console.log('Space Complexity:', jsResult.spaceComplexity);
console.log('Details:', jsResult.details.map(d => `${d.type}: ${d.description} (${d.complexity})`));
console.log('');

console.log('2. Python Analysis:');
const pythonResult = analyzer.analyzeCode(pythonCode, 'python');
console.log('Time Complexity:', pythonResult.timeComplexity);
console.log('Space Complexity:', pythonResult.spaceComplexity);
console.log('Details:', pythonResult.details.map(d => `${d.type}: ${d.description} (${d.complexity})`));
console.log('');

console.log('3. Java Analysis:');
const javaResult = analyzer.analyzeCode(javaCode, 'java');
console.log('Time Complexity:', javaResult.timeComplexity);
console.log('Space Complexity:', javaResult.spaceComplexity);
console.log('Details:', javaResult.details.map(d => `${d.type}: ${d.description} (${d.complexity})`));
console.log('');

console.log('4. C Analysis:');
const cResult = analyzer.analyzeCode(cCode, 'c');
console.log('Time Complexity:', cResult.timeComplexity);
console.log('Space Complexity:', cResult.spaceComplexity);
console.log('Details:', cResult.details.map(d => `${d.type}: ${d.description} (${d.complexity})`));
console.log('');

console.log('=== Test Summary ===');
console.log('JavaScript - Expected: O(V+E) or O(n^2), Got:', jsResult.timeComplexity);
console.log('Python - Expected: O(2^n), Got:', pythonResult.timeComplexity);
console.log('Java - Expected: O(V+E) or O(2^n), Got:', javaResult.timeComplexity);
console.log('C - Expected: O(V+E) or O(2^n), Got:', cResult.timeComplexity);
