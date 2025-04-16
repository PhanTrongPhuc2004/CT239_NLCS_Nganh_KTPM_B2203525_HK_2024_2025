const fs = window.require('fs'); // Sử dụng fs từ Node.js trong Electron

// Lưu đồ thị thành file JSON
function saveGraphToFile(graph, filename) {
    const vertices = graph.getVertices().map(vertex => {
        const pos = graph.getVertexPosition(vertex);
        return { id: vertex, x: pos.x, y: pos.y };
    });
    const edges = graph.getEdges().map(edge => ({
        u: edge.u,
        v: edge.v,
        w: edge.w,
    }));

    const graphData = { vertices, edges };
    const jsonData = JSON.stringify(graphData, null, 2);

    try {
        fs.writeFileSync(filename, jsonData);
        return true;
    } catch (error) {
        console.error('Error saving file:', error);
        return false;
    }
}

// Mở file JSON và tái tạo đồ thị
function loadGraphFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const graphData = JSON.parse(data);
        return graphData; // Trả về dữ liệu JSON để tái tạo đồ thị
    } catch (error) {
        console.error('Error loading file:', error);
        return null;
    }
}
module.exports = {
    saveGraphToFile,
    loadGraphFromFile,
};