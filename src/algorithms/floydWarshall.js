const Matrix = require('../dataStructures/matrix.js');

// Thuật toán Floyd-Warshall tìm đường đi ngắn nhất giữa tất cả các cặp đỉnh, hỗ trợ trọng số âm

// Tìm đường đi ngắn nhất sử dụng thuật toán Floyd-Warshall
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @returns {Object} - Đối tượng chứa distances (ma trận khoảng cách), predecessors (ma trận đỉnh trước), và vertexIndex (ánh xạ đỉnh sang chỉ số)
// @throws {Error} - Nếu đồ thị chứa chu trình âm
function floydWarshall(graph) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const edges = graph.getEdges(); // Danh sách các cạnh
    const n = vertices.length; // Số đỉnh

    // Ánh xạ đỉnh thành chỉ số để sử dụng trong ma trận
    const vertexIndex = new Map(vertices.map((v, idx) => [v, idx]));

    // Khởi tạo ma trận khoảng cách và ma trận đỉnh trước
    const distances = new Matrix(n); // Giá trị mặc định là Infinity
    const predecessors = new Matrix(n, null); // Giá trị mặc định là null

    // Khởi tạo khoảng cách ban đầu
    for (let i = 0; i < n; i++) {
        distances.set(i, i, 0); // Khoảng cách từ đỉnh đến chính nó là 0
    }
    edges.forEach(edge => {
        const { u, v, w } = edge;
        const i = vertexIndex.get(u);
        const j = vertexIndex.get(v);
        distances.set(i, j, w);
        distances.set(j, i, w); // Đồ thị vô hướng
        predecessors.set(i, j, u);
        predecessors.set(j, i, v);
    });

    // Thuật toán Floyd-Warshall: cập nhật khoảng cách ngắn nhất
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (distances.get(i, k) + distances.get(k, j) < distances.get(i, j)) {
                    distances.set(i, j, distances.get(i, k) + distances.get(k, j));
                    predecessors.set(i, j, predecessors.get(k, j));
                }
            }
        }
    }

    // Kiểm tra chu trình âm
    for (let i = 0; i < n; i++) {
        if (distances.get(i, i) < 0) {
            throw new Error("Đồ thị chứa chu trình âm");
        }
    }

    return { distances, predecessors, vertexIndex };
}

module.exports = floydWarshall;