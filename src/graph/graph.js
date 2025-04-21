const Vertex = require('./vertex.js');
const Edge = require('./edge.js');

// Lớp Graph quản lý cấu trúc đồ thị vô hướng
class Graph {
    // Khởi tạo đồ thị
    constructor() {
        this.vertices = []; // Danh sách các đỉnh
        this.edges = []; // Danh sách các cạnh
    }

    // Thêm đỉnh vào đồ thị
    // @param {number} id - ID của đỉnh
    // @param {string} label - Nhãn của đỉnh
    // @param {number} x - Tọa độ x
    // @param {number} y - Tọa độ y
    // @returns {boolean} - True nếu thêm thành công
    addVertex(id, label, x, y) {
        if (this.vertices.find(v => v.id === id)) return false;
        this.vertices.push(new Vertex(id, label, x, y));
        return true;
    }

    // Xóa đỉnh khỏi đồ thị
    // @param {number} id - ID của đỉnh
    // @returns {boolean} - True nếu xóa thành công
    removeVertex(id) {
        this.vertices = this.vertices.filter(v => v.id !== id);
        this.edges = this.edges.filter(e => e.u !== id && e.v !== id);
        return true;
    }

    // Thêm cạnh vào đồ thị
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @param {number} w - Trọng số cạnh
    // @returns {boolean} - True nếu thêm thành công
    addEdge(u, v, w) {
        if (!this.getVertexById(u) || !this.getVertexById(v)) return false;
        if (this.hasEdge(u, v)) return false;
        this.edges.push(new Edge(u, v, w));
        return true;
    }

    // Xóa cạnh khỏi đồ thị
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @returns {boolean} - True nếu xóa thành công
    removeEdge(u, v) {
        const index = this.edges.findIndex(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        if (index === -1) return false;
        this.edges.splice(index, 1);
        return true;
    }

    // Cập nhật trọng số cạnh
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @param {number} w - Trọng số mới
    // @returns {boolean} - True nếu cập nhật thành công
    setEdgeWeight(u, v, w) {
        const edge = this.edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        if (!edge) return false;
        edge.setWeight(w);
        return true;
    }

    // Kiểm tra xem cạnh có tồn tại không
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @returns {boolean} - True nếu cạnh tồn tại
    hasEdge(u, v) {
        return this.edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    }

    // Lấy danh sách đỉnh kề
    // @param {number} v - ID đỉnh
    // @returns {number[]} - Danh sách ID các đỉnh kề
    getNeighbors(v) {
        const neighbors = [];
        this.edges.forEach(edge => {
            if (edge.u === v) neighbors.push(edge.v);
            if (edge.v === v) neighbors.push(edge.u);
        });
        return neighbors;
    }

    // Lấy trọng số cạnh
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @returns {number|null} - Trọng số cạnh hoặc null nếu không tồn tại
    getEdgeWeight(u, v) {
        const edge = this.edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        return edge ? edge.w : null;
    }

    // Lấy đỉnh theo ID
    // @param {number} id - ID đỉnh
    // @returns {Vertex|null} - Đối tượng đỉnh hoặc null nếu không tồn tại
    getVertexById(id) {
        return this.vertices.find(v => v.id === id) || null;
    }

    // Lấy vị trí của đỉnh
    // @param {number} id - ID đỉnh
    // @returns {Object} - Tọa độ {x, y} của đỉnh
    getVertexPosition(id) {
        const v = this.getVertexById(id);
        return v ? { x: v.x, y: v.y } : { x: 0, y: 0 };
    }

    // Cập nhật vị trí đỉnh
    // @param {number} id - ID đỉnh
    // @param {number} x - Tọa độ x mới
    // @param {number} y - Tọa độ y mới
    setVertexPosition(id, x, y) {
        const v = this.getVertexById(id);
        if (v) v.setPosition(x, y);
    }

    // Lấy nhãn của đỉnh
    // @param {number} id - ID đỉnh
    // @returns {string|null} - Nhãn của đỉnh hoặc null nếu không tồn tại
    getVertexLabel(id) {
        const v = this.getVertexById(id);
        return v ? v.label : null;
    }

    // Lấy danh sách ID các đỉnh
    // @returns {number[]} - Mảng ID của tất cả đỉnh
    getVertices() {
        return this.vertices.map(v => v.id);
    }

    // Lấy danh sách các cạnh
    // @returns {Edge[]} - Mảng các đối tượng cạnh
    getEdges() {
        return this.edges;
    }

    // Chuyển đồ thị thành JSON
    // @returns {Object} - Đối tượng JSON chứa vertices và edges
    toJSON() {
        return {
            vertices: this.vertices,
            edges: this.edges
        };
    }

    // Tạo đồ thị từ JSON
    // @param {Object} json - Dữ liệu JSON chứa vertices và edges
    // @returns {Graph} - Đối tượng đồ thị mới
    static fromJSON(json) {
        const g = new Graph();
        json.vertices.forEach(v => g.vertices.push(Vertex.fromJSON(v)));
        json.edges.forEach(e => g.edges.push(Edge.fromJSON(e)));
        return g;
    }

    // Tạo đồ thị từ ma trận kề
    // @param {string} matrixText - Chuỗi chứa ma trận kề
    // @param {number} canvasWidth - Chiều rộng canvas
    // @param {number} canvasHeight - Chiều cao canvas
    fromAdjacencyMatrix(matrixText, canvasWidth, canvasHeight) {
        // Xóa đồ thị hiện tại
        this.vertices = [];
        this.edges = [];

        // Parse ma trận từ chuỗi
        const lines = matrixText.trim().split('\n').map(line => line.trim());
        const n = lines.length;
        if (n === 0) throw new Error('Ma trận rỗng.');

        // Kiểm tra ma trận vuông
        for (let i = 0; i < n; i++) {
            const row = lines[i].split(/\s+/);
            if (row.length !== n) throw new Error('Ma trận không vuông.');
        }

        // Tạo các đỉnh theo lưới
        const gridSize = Math.ceil(Math.sqrt(n));
        const cellWidth = canvasWidth / (gridSize + 1);
        const cellHeight = canvasHeight / (gridSize + 1);

        for (let i = 0; i < n; i++) {
            const id = i + 1;
            const label = String.fromCharCode(65 + i); // A, B, C, ...
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = (col + 1) * cellWidth;
            const y = (row + 1) * cellHeight;
            this.addVertex(id, label, x, y);
        }

        // Tạo các cạnh từ ma trận
        for (let i = 0; i < n; i++) {
            const row = lines[i].split(/\s+/);
            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const weight = row[j].toUpperCase() === 'INF' ? Infinity : parseFloat(row[j]);
                if (!isNaN(weight) && weight !== Infinity && weight !== 0) {
                    this.addEdge(i + 1, j + 1, weight);
                }
            }
        }
    }
}

module.exports = Graph;