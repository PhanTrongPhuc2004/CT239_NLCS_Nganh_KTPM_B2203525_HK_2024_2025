const Queue = require('../dataStructures/queue.js');

// Thuật toán BFS (Breadth-First Search) tìm đường đi ngắn nhất theo số cạnh từ một đỉnh

// Tìm đường đi ngắn nhất sử dụng thuật toán BFS
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @param {number} start - ID của đỉnh bắt đầu
// @returns {Object} - Đối tượng chứa distances (khoảng cách) và predecessors (đỉnh trước đó)
function bfs(graph, start) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const distances = {}; // Lưu khoảng cách (số cạnh) từ start đến mỗi đỉnh
    const predecessors = {}; // Lưu đỉnh trước đó trên đường đi ngắn nhất
    const visited = {}; // Trạng thái đã thăm của các đỉnh
    const queue = new Queue(); // Hàng đợi để duyệt BFS

    // Khởi tạo khoảng cách, đỉnh trước, và trạng thái
    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
        predecessors[vertex] = null;
        visited[vertex] = false;
    });

    distances[start] = 0;
    visited[start] = true;
    queue.enqueue(start);

    // Duyệt BFS theo thứ tự gần đến xa
    while (!queue.isEmpty()) {
        const u = queue.dequeue();
        const neighbors = graph.getNeighbors(u);

        // Xét các đỉnh kề chưa thăm
        for (const v of neighbors) {
            if (!visited[v]) {
                visited[v] = true;
                distances[v] = distances[u] + 1; // Tăng khoảng cách lên 1
                predecessors[v] = u;
                queue.enqueue(v);
            }
        }
    }

    return { distances, predecessors };
}

module.exports = bfs;