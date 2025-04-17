const Stack = require('../dataStructures/stack.js');

function dfs(graph) {
    const vertices = graph.getVertices();
    const visited = {};
    const stack = new Stack();
    let count = 0; // Số thành phần liên thông
    const components = []; // Danh sách các đỉnh trong mỗi thành phần liên thông

    // Khởi tạo visited
    vertices.forEach(vertex => {
        visited[vertex] = false;
    });

    // Duyệt từng đỉnh
    vertices.forEach(vertex => {
        if (!visited[vertex]) {
            count++;
            const component = []; // Các đỉnh trong thành phần liên thông hiện tại
            stack.push(vertex);

            while (!stack.isEmpty()) {
                const v = stack.pop();
                if (!visited[v]) { // Chỉ xử lý nếu chưa thăm
                    visited[v] = true;
                    component.push(v);

                    // Lấy các đỉnh kề
                    const neighbors = graph.getNeighbors(v);
                    neighbors.forEach(z => {
                        if (!visited[z]) {
                            stack.push(z);
                        }
                    });
                }
            }
            //sắp xếp lại thành phần liên thông
            component.sort((a, b) => a - b); // Sắp xếp theo ID
            // Thêm vào danh sách thành phần liên thông
            components.push(component);
        }
    });

    return { count, components };
}

module.exports = dfs;