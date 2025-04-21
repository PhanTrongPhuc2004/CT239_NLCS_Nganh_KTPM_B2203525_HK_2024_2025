// Thuật toán Bellman-Ford tìm đường đi ngắn nhất từ một đỉnh đến tất cả các đỉnh khác, hỗ trợ trọng số âm

// Tìm đường đi ngắn nhất sử dụng thuật toán Bellman-Ford
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @param {number} start - ID của đỉnh bắt đầu
// @returns {Object} - Đối tượng chứa distances (khoảng cách) và predecessors (đỉnh trước đó)
// @throws {Error} - Nếu đồ thị chứa chu trình âm
function bellmanFord(graph, start) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const edges = graph.getEdges(); // Danh sách các cạnh
    const distances = {}; // Lưu khoảng cách ngắn nhất từ start đến mỗi đỉnh
    const predecessors = {}; // Lưu đỉnh trước đó trên đường đi ngắn nhất

    // Khởi tạo khoảng cách và đỉnh trước
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
    });
    distances[start] = 0;

    // Lặp |V| - 1 lần để tìm khoảng cách ngắn nhất
    for (let i = 0; i < vertices.length - 1; i++) {
        edges.forEach(edge => {
            const { u, v, w } = edge;
            // Cập nhật khoảng cách cho chiều u -> v
            if (distances[u] + w < distances[v]) {
                distances[v] = distances[u] + w;
                predecessors[v] = u;
            }
            // Cập nhật khoảng cách cho chiều v -> u (đồ thị vô hướng)
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
            throw new Error("Đồ thị chứa chu trình âm");
        }
    }

    return { distances, predecessors };
}

module.exports = bellmanFord;