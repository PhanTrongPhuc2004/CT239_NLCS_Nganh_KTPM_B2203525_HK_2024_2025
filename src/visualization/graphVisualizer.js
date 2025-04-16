const d3 = require('d3');

// Đồ thị trực quan hóa
// Đồ thị này sử dụng D3.js để vẽ đồ thị với các đỉnh và cạnh
// Nó cũng hỗ trợ làm nổi bật các đỉnh và cạnh trong quá trình tìm kiếm đường đi ngắn nhất
// và có thể cập nhật vị trí của các đỉnh khi người dùng kéo thả chúng
class GraphVisualizer {
    constructor(svgId, width, height) {
        this.width = width;
        this.height = height;
        this.svg = d3.select(svgId)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`);

        // Nhóm cho các cạnh
        this.edges = this.svg.append('g').attr('class', 'edges');
        // Nhóm cho các trọng số cạnh
        this.weights = this.svg.append('g').attr('class', 'weights');
        // Nhóm cho các đỉnh
        this.nodes = this.svg.append('g').attr('class', 'nodes');

        this.graph = null;
    }

    // Cập nhật và vẽ đồ thị
    updateGraph(graph) {
        this.graph = graph;
        const vertices = graph.getVertices();
        const edges = graph.getEdges();

        // Dữ liệu cho đỉnh
        const nodeData = vertices.map(vertex => {
            const pos = graph.getVertexPosition(vertex);
            return { id: vertex, x: pos.x, y: pos.y };
        });

        // Dữ liệu cho cạnh
        const edgeData = edges.map(edge => {
            const sourcePos = graph.getVertexPosition(edge.u);
            const targetPos = graph.getVertexPosition(edge.v);
            return {
                source: edge.u,
                target: edge.v,
                weight: edge.w,
                x1: sourcePos.x,
                y1: sourcePos.y,
                x2: targetPos.x,
                y2: targetPos.y,
            };
        });

        // Vẽ cạnh
        const edgeSelection = this.edges.selectAll('.edge')
            .data(edgeData, d => `${d.source}-${d.target}`);

        edgeSelection.exit().remove();

        edgeSelection.enter()
            .append('line')
            .attr('class', 'edge')
            .merge(edgeSelection)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2);

        // Vẽ trọng số cạnh
        const weightSelection = this.weights.selectAll('.edge-weight')
            .data(edgeData, d => `${d.source}-${d.target}`);

        weightSelection.exit().remove();

        weightSelection.enter()
            .append('text')
            .attr('class', 'edge-weight')
            .merge(weightSelection)
            .attr('x', d => (d.x1 + d.x2) / 2)
            .attr('y', d => (d.y1 + d.y2) / 2 - 5)
            .text(d => d.weight);

        // Vẽ đỉnh
        const nodeSelection = this.nodes.selectAll('.node')
            .data(nodeData, d => d.id);

        nodeSelection.exit().remove();

        const nodeEnter = nodeSelection.enter()
            .append('g')
            .attr('class', 'node');

        nodeEnter.append('circle')
            .attr('r', 20);

        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .text(d => d.id);

        nodeSelection.merge(nodeEnter)
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
    }

    // Làm nổi bật đường đi ngắn nhất
    highlightPath(path) {
        this.clearHighlights();

        // Làm nổi bật các cạnh trên đường đi
        this.edges.selectAll('.edge')
            .filter(d => {
                for (let i = 0; i < path.length - 1; i++) {
                    const u = path[i];
                    const v = path[i + 1];
                    if ((d.source === u && d.target === v) || (d.source === v && d.target === u)) {
                        return true;
                    }
                }
                return false;
            })
            .classed('path-edge', true);

        // Làm nổi bật các đỉnh trên đường đi
        this.nodes.selectAll('.node')
            .filter(d => path.includes(d.id))
            .classed('highlighted', true);
    }

    // Làm nổi bật các đỉnh đã thăm
    highlightVisited(vertices) {
        this.nodes.selectAll('.node')
            .filter(d => vertices.includes(d.id))
            .classed('highlighted', true);
    }

    // Xóa các highlight
    clearHighlights() {
        this.edges.selectAll('.edge').classed('path-edge', false);
        this.nodes.selectAll('.node').classed('highlighted', false);
    }
}
module.exports = GraphVisualizer;