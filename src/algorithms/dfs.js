const Stack = require('../dataStructures/stack.js');

// Thuật toán DFS (Depth-First Search) tìm các thành phần liên thông trong đồ thị

// Tìm các thành phần liên thông sử dụng thuật toán DFS
// @param {Graph} graph - Đối tượng đồ thị vô hướng
// @returns {Object} - Đối tượng chứa count (số thành phần liên thông) và components (danh sách các đỉnh trong mỗi thành phần)
function dfs(graph) {
    const vertices = graph.getVertices(); // Danh sách các đỉnh
    const visited = {}; // Trạng thái đã thăm của các đỉnh
    const stack = new Stack(); // Ngăn xếp để duyệt DFS
    let count = 0; // Số thành phần liên thông
    const components = []; // Danh sách các thành phần liên thông

    // Khởi tạo trạng thái chưa thăm
    vertices.forEach(vertex => {
        visited[vertex] = false;
    });

    // Duyệt từng đỉnh chưa thăm
    vertices.forEach(vertex => {
        if (!visited[vertex]) {
            count++;
            const component = []; // Danh sách đỉnh trong thành phần liên thông hiện tại
            stack.push(vertex);

            // Duyệt DFS sử dụng ngăn xếp
            while (!stack.isEmpty()) {
                const v = stack.pop();
                if (!visited[v]) {
                    visited[v] = true;
                    component.push(v);

                    // Thêm các đỉnh kề chưa thăm vào ngăn xếp
                    const neighbors = graph.getNeighbors(v);
                    neighbors.forEach(z => {
                        if (!visited[z]) {
                            stack.push(z);
                        }
                    });
                }
            }

            // Sắp xếp thành phần liên thông theo ID
            component.sort((a, b) => a - b);
            components.push(component);
        }
    });

    return { count, components };
}

module.exports = dfs;