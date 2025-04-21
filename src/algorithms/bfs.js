const Queue = require('../dataStructures/queue.js');

function bfs(graph, start) {
    const vertices = graph.getVertices();
    const distances = {};
    const predecessors = {};
    const visited = {};
    const queue = new Queue();

    // Khởi tạo
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    distances[start] = 0;
    visited[start] = true;
    queue.enqueue(start);

    // Duyệt BFS
    while (!queue.isEmpty()) {
        const u = queue.dequeue();
        const neighbors = graph.getNeighbors(u);

        for (const v of neighbors) {
            if (!visited[v]) {
                visited[v] = true;
                distances[v] = distances[u] + 1;
                predecessors[v] = u;
                queue.enqueue(v);
            }
        }
    }

    return { distances, predecessors };
}
module.exports = bfs;