const remote = require('@electron/remote'); // Sử dụng @electron/remote
const fs = require('fs'); // Sử dụng fs từ Node.js
const dialog = remote.dialog; // Lấy dialog từ remote

// Lưu đồ thị thành file JSON
async function saveGraphToFile(graph) {
    const vertices = graph.getVertices().map(vertex => {
        const pos = graph.getVertexPosition(vertex);
        const label = graph.getVertexLabel(vertex);
        return { id: vertex, label: label, x: pos.x, y: pos.y };
    });
    const edges = graph.getEdges().map(edge => ({
        u: edge.u,
        v: edge.v,
        w: edge.w,
    }));

    const graphData = { vertices, edges };
    const jsonData = JSON.stringify(graphData, null, 2);

    // Hiển thị cửa sổ chọn nơi lưu file
    const result = await dialog.showSaveDialog({
        title: 'Save Graph',
        defaultPath: 'graph.json',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    const savePath = result.filePath;

    if (savePath) {
        try {
            fs.writeFileSync(savePath, jsonData);
            return true;
        } catch (error) {
            console.error('Error saving file:', error);
            return false;
        }
    } else {
        console.log('Save operation was canceled.');
        return false;
    }
}

// Mở file JSON và tái tạo đồ thị
async function loadGraphFromFile() {
    // Hiển thị cửa sổ chọn file
    const result = await dialog.showOpenDialog({
        title: 'Open Graph',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile'],
    });

    const filePaths = result.filePaths;

    if (filePaths && filePaths.length > 0) {
        try {
            const data = fs.readFileSync(filePaths[0], 'utf8');
            const graphData = JSON.parse(data);
            return graphData;
        } catch (error) {
            console.error('Error loading file:', error);
            return null;
        }
    } else {
        console.log('Open operation was canceled.');
        return null;
    }
}

module.exports = {
    saveGraphToFile,
    loadGraphFromFile,
};