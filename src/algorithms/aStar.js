const PriorityQueue = require('../dataStructures/priorityQueue.js');

function aStar(graph, start, end) {
    const vertices = graph.getVertices();
    const g = {}; // Chi phí từ nguồn đến đỉnh
    const f = {}; // Ước lượng chi phí tổng (g + h)
    const predecessors = {};
    const visited = {};
    const pq = new PriorityQueue();

    // Khởi tạo
    vertices.forEach(vertex => {
        g[vertex] = Infinity;
        f[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    // Hàm heuristic: khoảng cách Euclidean
    const h = vertex => {
        const posV = graph.getVertexPosition(vertex);
        const posEnd = graph.getVertexPosition(end);
        return Math.sqrt(
            (posV.x - posEnd.x) ** 2 + (posV.y - posEnd.y) ** 2
        );
    };

    g[start] = 0;
    f[start] = h(start);
    pq.enqueue(start, f[start]);

    while (!pq.isEmpty()) {
        const u = pq.dequeue();
        if (u === end) break;
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

    const distances = g; // Khoảng cách từ nguồn đến các đỉnh
    return { distances, predecessors };
}
module.exports = aStar;