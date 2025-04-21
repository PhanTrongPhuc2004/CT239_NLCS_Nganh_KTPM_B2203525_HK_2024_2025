const remote = require('@electron/remote'); // Module để tương tác với Electron
const fs = require('fs'); // Module để thao tác với hệ thống file
const dialog = remote.dialog; // Đối tượng dialog từ Electron remote

// Lưu đồ thị thành file JSON
// @param {Graph} graph - Đối tượng đồ thị cần lưu
// @returns {Promise<boolean>} - True nếu lưu thành công, False nếu thất bại hoặc bị hủy
async function saveGraphToFile(graph) {
    // Chuẩn bị dữ liệu đỉnh
    const vertices = graph.getVertices().map(vertex => {
        const pos = graph.getVertexPosition(vertex);
        const label = graph.getVertexLabel(vertex);
        return { id: vertex, label: label, x: pos.x, y: pos.y };
    });
    // Chuẩn bị dữ liệu cạnh
    const edges = graph.getEdges().map(edge => ({
        u: edge.u,
        v: edge.v,
        w: edge.w,
    }));
    // Tạo đối tượng dữ liệu đồ thị
    const graphData = { vertices, edges };
    const jsonData = JSON.stringify(graphData, null, 2);

    // Hiển thị cửa sổ chọn nơi lưu file
    const result = await dialog.showSaveDialog({
        title: 'Lưu đồ thị',
        defaultPath: 'graph.json',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    const savePath = result.filePath;

    if (savePath) {
        try {
            // Ghi dữ liệu vào file
            fs.writeFileSync(savePath, jsonData);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu file:', error);
            return false;
        }
    } else {
        console.log('Thao tác lưu file đã bị hủy.');
        return false;
    }
}

// Tải đồ thị từ file JSON
// @returns {Promise<Object|null>} - Dữ liệu đồ thị hoặc null nếu thất bại hoặc bị hủy
async function loadGraphFromFile() {
    // Hiển thị cửa sổ chọn file
    const result = await dialog.showOpenDialog({
        title: 'Mở đồ thị',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile'],
    });

    const filePaths = result.filePaths;

    if (filePaths && filePaths.length > 0) {
        try {
            // Đọc dữ liệu từ file
            const data = fs.readFileSync(filePaths[0], 'utf8');
            const graphData = JSON.parse(data);
            return graphData;
        } catch (error) {
            console.error('Lỗi khi tải file:', error);
            return null;
        }
    } else {
        console.log('Thao tác mở file đã bị hủy.');
        return null;
    }
}

module.exports = {
    saveGraphToFile,
    loadGraphFromFile,
};