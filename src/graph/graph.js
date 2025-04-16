const Vertex = require('./vertex.js');
const Edge = require('./edge.js');

class Graph {
    constructor() {
        this.vertices = new Map(); // Map lưu đỉnh: {id: Vertex}
        this.edges = []; // Danh sách cạnh
    }

    // Thêm đỉnh
    addVertex(id, label, x, y) {
        if (this.vertices.has(id)) {
            return false; // Đỉnh đã tồn tại
        }
        const vertex = new Vertex(id, label, x, y);
        this.vertices.set(id, vertex);
        return true;
    }

    // Xóa đỉnh và tất cả cạnh liên quan
    removeVertex(id) {
        if (!this.vertices.has(id)) {
            return false; // Đỉnh không tồn tại
        }
        // Xóa tất cả cạnh liên quan đến đỉnh này
        this.edges = this.edges.filter(edge => !edge.hasVertex(id));
        // Xóa đỉnh
        this.vertices.delete(id);
        return true;
    }

    // Cập nhật tọa độ của đỉnh (khi di chuyển)
    updateVertexPosition(id, x, y) {
        const vertex = this.vertices.get(id);
        if (!vertex) {
            return false;
        }
        vertex.x = x;
        vertex.y = y;
        return true;
    }

    // Thêm cạnh (vô hướng)
    addEdge(u, v, w) {
        if (!this.vertices.has(u) || !this.vertices.has(v)) {
            return false; // Một trong hai đỉnh không tồn tại
        }
        // Kiểm tra xem cạnh đã tồn tại chưa (vô hướng nên (u,v) và (v,u) là như nhau)
        if (this.hasEdge(u, v)) {
            return false;
        }
        const edge = new Edge(u, v, w);
        this.edges.push(edge);
        return true;
    }

    // Xóa cạnh
    removeEdge(u, v) {
        const index = this.edges.findIndex(edge =>
            (edge.u === u && edge.v === v) || (edge.u === v && edge.v === u)
        );
        if (index === -1) {
            return false; // Cạnh không tồn tại
        }
        this.edges.splice(index, 1);
        return true;
    }

    // Kiểm tra xem cạnh (u,v) có tồn tại không
    hasEdge(u, v) {
        return this.edges.some(edge =>
            (edge.u === u && edge.v === v) || (edge.u === v && edge.v === u)
        );
    }

    // Lấy danh sách các đỉnh kề của một đỉnh
    getNeighbors(vertexId) {
        const neighbors = [];
        for (const edge of this.edges) {
            if (edge.u === vertexId) {
                neighbors.push({ id: edge.v, weight: edge.w });
            } else if (edge.v === vertexId) {
                neighbors.push({ id: edge.u, weight: edge.w });
            }
        }
        return neighbors;
    }

    // Lấy trọng số của cạnh giữa hai đỉnh
    getEdgeWeight(u, v) {
        const edge = this.edges.find(edge =>
            (edge.u === u && edge.v === v) || (edge.u === v && edge.v === u)
        );
        return edge ? edge.w : null;
    }

    // Chuyển đổi thành JSON để lưu trữ
    toJSON() {
        return {
            vertices: Array.from(this.vertices.entries()).map(([id, vertex]) => vertex.toJSON()),
            edges: this.edges.map(edge => edge.toJSON()),
        };
    }

    // Tạo Graph từ JSON
    static fromJSON(json) {
        const graph = new Graph();
        // Thêm các đỉnh
        for (const vertexData of json.vertices) {
            const vertex = Vertex.fromJSON(vertexData);
            graph.vertices.set(vertex.id, vertex);
        }
        // Thêm các cạnh
        for (const edgeData of json.edges) {
            const edge = Edge.fromJSON(edgeData);
            graph.edges.push(edge);
        }
        return graph;
    }
}
// Lấy danh sách các đỉnh
Graph.prototype.getVertices = function () {
    return Array.from(this.vertices.keys());
};

// Lấy danh sách các cạnh
Graph.prototype.getEdges = function () {
    return Array.from(this.edges.values());
};

// Lấy tọa độ của một đỉnh
Graph.prototype.getVertexPosition = function (vertex) {
    const v = this.vertices.get(vertex);
    return v ? v.getPosition() : { x: 0, y: 0 };
};

// Cập nhật tọa độ của một đỉnh
Graph.prototype.setVertexPosition = function (vertex, x, y) {
    const v = this.vertices.get(vertex);
    if (v) {
        v.setPosition(x, y);
    }
};
module.exports = Graph;