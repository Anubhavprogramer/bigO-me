// Test file for DAG longest path algorithm detection

function longestPathDAG(V, edges, source) {
    // Build adjacency list and calculate in-degrees
    const adj = Array.from({ length: V }, () => []);
    const inDegree = Array(V).fill(0);
    
    for (const [u, v] of edges) {
        adj[u].push(v);
        inDegree[v]++;
    }
    
    // Topological sort using Kahn's algorithm
    const queue = [];
    for (let i = 0; i < V; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const topoOrder = [];
    while (queue.length > 0) {
        const node = queue.shift();
        topoOrder.push(node);
        
        for (const neighbor of adj[node]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Dynamic programming to find longest path
    const dp = Array(V).fill(-Infinity);
    dp[source] = 0;
    
    for (const u of topoOrder) {
        if (dp[u] !== -Infinity) {
            for (const v of adj[u]) {
                dp[v] = Math.max(dp[v], dp[u] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}

// Another DAG algorithm example
function shortestPathDAG(graph, start, end) {
    const visited = new Set();
    const distances = new Map();
    const queue = [start];
    
    distances.set(start, 0);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (current === end) {
            return distances.get(current);
        }
        
        if (!visited.has(current)) {
            visited.add(current);
            
            for (const neighbor of graph[current] || []) {
                const newDistance = distances.get(current) + 1;
                if (!distances.has(neighbor) || newDistance < distances.get(neighbor)) {
                    distances.set(neighbor, newDistance);
                    queue.push(neighbor);
                }
            }
        }
    }
    
    return -1; // No path found
}

// Topological sort standalone
function topologicalSort(V, edges) {
    const adj = Array.from({ length: V }, () => []);
    const inDegree = Array(V).fill(0);
    
    // Build graph
    for (const [u, v] of edges) {
        adj[u].push(v);
        inDegree[v]++;
    }
    
    const queue = [];
    const result = [];
    
    // Find all nodes with no incoming edges
    for (let i = 0; i < V; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of adj[node]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === V ? result : []; // Empty array if cycle detected
}

// Example usage
const V = 6;
const edges = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
console.log("Longest path:", longestPathDAG(V, edges, 5));
console.log("Topological order:", topologicalSort(V, edges));
