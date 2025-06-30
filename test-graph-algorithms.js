// Test file for graph algorithm detection

// BFS implementation
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (!visited.has(node)) {
            visited.add(node);
            console.log(node);
            
            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
    }
}

// DFS implementation
function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start);
    
    for (const neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}

// Graph traversal with adjacency list
function traverseGraph(adjacencyList) {
    const visited = new Set();
    
    for (const vertex in adjacencyList) {
        if (!visited.has(vertex)) {
            const stack = [vertex];
            
            while (stack.length > 0) {
                const current = stack.pop();
                
                if (!visited.has(current)) {
                    visited.add(current);
                    
                    for (const neighbor of adjacencyList[current]) {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }
}

// Another example with edges
function findPath(edges, start, end) {
    const graph = {};
    
    // Build adjacency list from edges
    for (const [u, v] of edges) {
        if (!graph[u]) graph[u] = [];
        if (!graph[v]) graph[v] = [];
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Set();
    const queue = [start];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node === end) {
            return true;
        }
        
        if (!visited.has(node)) {
            visited.add(node);
            
            for (const neighbor of graph[node]) {
                queue.push(neighbor);
            }
        }
    }
    
    return false;
}
