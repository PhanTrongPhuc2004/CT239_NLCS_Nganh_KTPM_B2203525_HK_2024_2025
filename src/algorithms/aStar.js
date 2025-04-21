const PriorityQueue = require('../dataStructures/priorityQueue.js');

// Thuật toán A* tìm đường đi ngắn nhất từ một đỉnh đến một đỉnh đích, sử dụng heuristic dựa trên khoảng cách Euclidean

// Tìm đường đi ngắn nhất sử dụng thuật toán A*
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @param {number} start - ID của đỉnh bắt đầu
// @param {number} end - ID của đỉnh đích
// @returns {Object} - Đối tượng chứa distances (khoảng cách) và predecessors (đỉnh trước đó)
function aStar(graph, start, end) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const g = {}; // Chi phí thực tế từ start đến mỗi đỉnh
    const f = {}; // Chi phí ước tính (g + heuristic)
    const predecessors = {}; // Lưu đỉnh trước đó trên đường đi ngắn nhất
    const visited = {}; // Trạng thái đã thăm của các đỉnh
    const pq = new PriorityQueue(); // Hàng đợi ưu tiên để chọn đỉnh có f nhỏ nhất

    // Khởi tạo chi phí, đỉnh trước, và trạng thái
    vertices.forEach(vertex => {
        g[vertex] = Infinity;
        f[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    // Hàm heuristic tính khoảng cách Euclidean chuẩn hóa
    const h = vertex => {
        const posV = graph.getVertexPosition(vertex);
        const posEnd = graph.getVertexPosition(end);
        const euclidean = Math.sqrt(
            (posV.x - posEnd.x) ** 2 + (posV.y - posEnd.y) ** 2
        );
        return euclidean / 150; // Chuẩn hóa để phù hợp với trọng số
    };

    // Khởi tạo đỉnh bắt đầu
    g[start] = 0;
    f[start] = h(start);
    pq.enqueue(start, f[start]);

    // Duyệt các đỉnh theo thứ tự chi phí ước tính tăng dần
    while (!pq.isEmpty()) {
        const u = pq.dequeue();
        if (visited[u]) continue;
        visited[u] = true;

        // Xét các đỉnh kề của u
        const neighbors = graph.getNeighbors(u);
        for (const v of neighbors) {
            const edge = graph.getEdges().find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
            const weight = edge ? edge.w : Infinity;

            // Cập nhật chi phí nếu tìm được đường đi tốt hơn
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