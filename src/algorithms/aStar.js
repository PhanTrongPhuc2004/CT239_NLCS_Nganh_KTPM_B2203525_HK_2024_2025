const PriorityQueue = require('../dataStructures/priorityQueue.js');

function aStar(graph, start, end) {
    const vertices = graph.getVertices();
    const g = {};
    const f = {};
    const predecessors = {};
    const visited = {};
    const pq = new PriorityQueue();

    vertices.forEach(vertex => {
        g[vertex] = Infinity;
        f[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    const h = vertex => {
        const posV = graph.getVertexPosition(vertex);
        const posEnd = graph.getVertexPosition(end);
        const euclidean = Math.sqrt(
            (posV.x - posEnd.x) ** 2 + (posV.y - posEnd.y) ** 2
        );
        return euclidean / 150; // Chuẩn hóa
    };

    g[start] = 0;
    f[start] = h(start);
    pq.enqueue(start, f[start]);

    while (!pq.isEmpty()) {
        const u = pq.dequeue();
        if (visited[u]) continue;
        visited[u] = true;
        const neighbors = graph.getNeighbors(u);
        for (const v of neighbors) {
            const edge = graph.getEdges().find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
            const weight = edge ? edge.w : Infinity;
            if (g[u] + weight < g[v]) {
                g[v] = g[u] + weight;
                f[v] = g[v] + h(v);
                predecessors[v] = u;
                pq.enqueue(v, f[v]);
            }
        }
    }

    const distances = g;
    return { distances, predecessors };
}

module.exports = aStar;