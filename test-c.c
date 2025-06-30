// C complexity test file
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// O(n^2) - Nested loops
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

// O(2^n) - Recursive Fibonacci
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// Queue structure for BFS
struct Queue {
    int items[1000];
    int front;
    int rear;
};

void enqueue(struct Queue* q, int value) {
    q->items[q->rear] = value;
    q->rear++;
}

int dequeue(struct Queue* q) {
    int item = q->items[q->front];
    q->front++;
    return item;
}

int isEmpty(struct Queue* q) {
    return q->rear == q->front;
}

// O(V + E) - Graph BFS
void bfs(int graph[][100], int vertices, int start) {
    int visited[100] = {0};
    struct Queue q = {0};
    
    visited[start] = 1;
    enqueue(&q, start);
    
    while (!isEmpty(&q)) {
        int node = dequeue(&q);
        printf("%d ", node);
        
        for (int i = 0; i < vertices; i++) {
            if (graph[node][i] && !visited[i]) {
                visited[i] = 1;
                enqueue(&q, i);
            }
        }
    }
}

// O(V + E) - Graph DFS
void dfs(int graph[][100], int vertices, int node, int visited[]) {
    visited[node] = 1;
    printf("%d ", node);
    
    for (int i = 0; i < vertices; i++) {
        if (graph[node][i] && !visited[i]) {
            dfs(graph, vertices, i, visited);
        }
    }
}

// O(V + E) - Topological Sort for DAG
void topologicalSort(int graph[][100], int vertices) {
    int inDegree[100] = {0};
    
    // Calculate in-degrees
    for (int u = 0; u < vertices; u++) {
        for (int v = 0; v < vertices; v++) {
            if (graph[u][v]) {
                inDegree[v]++;
            }
        }
    }
    
    struct Queue queue = {0};
    for (int i = 0; i < vertices; i++) {
        if (inDegree[i] == 0) {
            enqueue(&queue, i);
        }
    }
    
    while (!isEmpty(&queue)) {
        int u = dequeue(&queue);
        printf("%d ", u);
        
        for (int v = 0; v < vertices; v++) {
            if (graph[u][v]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    enqueue(&queue, v);
                }
            }
        }
    }
}

// O(n^3) - Matrix multiplication
void matrixMultiply(int A[][100], int B[][100], int C[][100], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}

// O(n) - Linear search
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// O(n log n) - Merge sort
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    free(L);
    free(R);
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
