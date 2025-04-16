const PriorityQueue = require('../dataStructures/priorityQueue.js');

function dijkstra(graph, start) {
    const vertices = graph.getVertices();
    const distances = {};
    const predecessors = {};
    const visited = {};
    const pq = new PriorityQueue();

    // Khởi tạo
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        const u = pq.dequeue();
        if (visited[u]) continue;

        visited[u] = true;
        const neighbors = graph.getNeighbors(u);

        for (const v of neighbors) {
            const edge = graph.getEdges().find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
            const weight = edge ? edge.w : Infinity;

            if (distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                predecessors[v] = u;
                pq.enqueue(v, distances[v]);
            }
        }
    }

    return { distances, predecessors };
}
module.exports = dijkstra;
