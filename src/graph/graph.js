const Vertex = require('./vertex.js');
const Edge = require('./edge.js');

class Graph {
    constructor() {
        this.vertices = []; // Danh sách đỉnh (array)
        this.edges = [];    // Danh sách cạnh (array)
    }

    addVertex(id, label, x, y) {
        if (this.vertices.find(v => v.id === id)) return false;
        this.vertices.push(new Vertex(id, label, x, y));
        return true;
    }

    removeVertex(id) {
        this.vertices = this.vertices.filter(v => v.id !== id);
        this.edges = this.edges.filter(e => e.u !== id && e.v !== id);
        return true;
    }

    updateVertexPosition(id, x, y) {
        const v = this.vertices.find(v => v.id === id);
        if (!v) return false;
        v.x = x;
        v.y = y;
        return true;
    }

    addEdge(u, v, w) {
        if (!this.getVertexById(u) || !this.getVertexById(v)) return false;
        if (this.hasEdge(u, v)) return false;
        this.edges.push(new Edge(u, v, w));
        return true;
    }

    removeEdge(u, v) {
        const index = this.edges.findIndex(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        if (index === -1) return false;
        this.edges.splice(index, 1);
        return true;
    }

    setEdgeWeight(u, v, w) {
        const edge = this.edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        if (!edge) return false;
        edge.setWeight(w);
        return true;
    }

    hasEdge(u, v) {
        return this.edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    }

    getNeighbors(v) {
        const neighbors = [];
        this.edges.forEach(edge => {
            if (edge.u === v) {
                neighbors.push(edge.v);
            }
            if (edge.v === v) {
                neighbors.push(edge.u);
            }
        });
        return neighbors;
    }

    getEdgeWeight(u, v) {
        const edge = this.edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        return edge ? edge.w : null;
    }

    getVertexById(id) {
        return this.vertices.find(v => v.id === id);
    }

    getVertexPosition(id) {
        const v = this.getVertexById(id);
        if (!v) {
            return { x: 0, y: 0 }; // Trả về mặc định nếu không tìm thấy đỉnh
        }
        return { x: v.x, y: v.y }; // Lấy trực tiếp x, y từ v
    }

    setVertexPosition(id, x, y) {
        const v = this.getVertexById(id);
        if (v) v.setPosition(x, y);
    }

    getVertexLabel(id) {
        const v = this.getVertexById(id);
        return v ? v.label : null;
    }

    getVertices() {
        return this.vertices.map(v => v.id);
    }

    getEdges() {
        return this.edges;
    }

    toJSON() {
        return {
            vertices: this.vertices, // Không cần gọi v.toJSON()
            edges: this.edges       // Không cần gọi e.toJSON()
        };
    }

    static fromJSON(json) {
        const g = new Graph();
        json.vertices.forEach(v => g.vertices.push(Vertex.fromJSON(v)));
        json.edges.forEach(e => g.edges.push(Edge.fromJSON(e)));
        return g;
    }
}

module.exports = Graph;