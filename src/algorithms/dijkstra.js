const PriorityQueue = require('../dataStructures/priorityQueue.js');

// Thuật toán Dijkstra tìm đường đi ngắn nhất từ một đỉnh đến tất cả các đỉnh khác, không hỗ trợ trọng số âm

// Tìm đường đi ngắn nhất sử dụng thuật toán Dijkstra
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @param {number} start - ID của đỉnh bắt đầu
// @returns {Object} - Đối tượng chứa distances (khoảng cách) và predecessors (đỉnh trước đó)
function dijkstra(graph, start) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const distances = {}; // Lưu khoảng cách ngắn nhất từ start đến mỗi đỉnh
    const predecessors = {}; // Lưu đỉnh trước đó trên đường đi ngắn nhất
    const visited = {}; // Trạng thái đã thăm của các đỉnh
    const pq = new PriorityQueue(); // Hàng đợi ưu tiên để chọn đỉnh có khoảng cách nhỏ nhất

    // Khởi tạo khoảng cách, đỉnh trước, và trạng thái
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });
    distances[start] = 0;
    pq.enqueue(start, 0);

    // Duyệt các đỉnh theo thứ tự khoảng cách tăng dần
    while (!pq.isEmpty()) {
        const u = pq.dequeue();
        if (visited[u]) continue;
        visited[u] = true;

        // Xét các đỉnh kề của u
        const neighbors = graph.getNeighbors(u);
        for (const v of neighbors) {
            const edge = graph.getEdges().find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
            const weight = edge ? edge.w : Infinity;

            // Cập nhật khoảng cách nếu tìm được đường đi ngắn hơn
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