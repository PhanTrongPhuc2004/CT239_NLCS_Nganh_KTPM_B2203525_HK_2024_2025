const Stack = require('../dataStructures/stack.js');

function dfs(graph) {
    const vertices = graph.getVertices();
    const visited = {};
    const stack = new Stack();
    let count = 0; // Số miền liên thông
    const components = []; // Danh sách các đỉnh trong mỗi miền liên thông

    vertices.forEach(vertex => {
        visited[vertex] = false;
    });

    vertices.forEach(vertex => {
        if (!visited[vertex]) {
            count++;
            const component = [];
            visited[vertex] = true;
            stack.push(vertex);
            component.push(vertex);

            while (!stack.isEmpty()) {
                const v = stack.pop();
                const neighbors = graph.getNeighbors(v);

                for (const z of neighbors) {
                    if (!visited[z]) {
                        visited[z] = true;
                        stack.push(z);
                        component.push(z);
                    }
                }
            }

            components.push(component);
        }
    });

    return { count, components };
}
module.exports = dfs;