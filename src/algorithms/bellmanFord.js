function bellmanFord(graph, start) {
    const vertices = graph.getVertices();
    const edges = graph.getEdges();
    const distances = {};
    const predecessors = {};

    // Khởi tạo
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
    });
    distances[start] = 0;

    // Lặp |V| - 1 lần
    for (let i = 0; i < vertices.length - 1; i++) {
        edges.forEach(edge => {
            const { u, v, w } = edge;
            if (distances[u] + w < distances[v]) {
                distances[v] = distances[u] + w;
                predecessors[v] = u;
            }
            // Đồ thị vô hướng, kiểm tra cả chiều ngược
            if (distances[v] + w < distances[u]) {
                distances[u] = distances[v] + w;
                predecessors[u] = v;
            }
        });
    }

    // Kiểm tra chu trình âm
    for (const edge of edges) {
        const { u, v, w } = edge;
        if (distances[u] + w < distances[v] || distances[v] + w < distances[u]) {
            throw new Error("Graph contains a negative-weight cycle");
        }
    }

    return { distances, predecessors };
}
module.exports = bellmanFord;