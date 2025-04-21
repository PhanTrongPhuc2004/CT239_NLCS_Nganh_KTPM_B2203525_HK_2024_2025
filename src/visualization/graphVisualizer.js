const d3 = require('d3');

// Lớp GraphVisualizer chịu trách nhiệm trực quan hóa đồ thị trên canvas sử dụng D3.js
class GraphVisualizer {
    // Khởi tạo GraphVisualizer
    // @param {string} svgId - ID của phần tử SVG trong DOM
    // @param {number} width - Chiều rộng canvas
    // @param {number} height - Chiều cao canvas
    constructor(svgId, width, height) {
        this.width = width; // Chiều rộng canvas
        this.height = height; // Chiều cao canvas
        // Tạo SVG chính
        this.svg = d3.select(svgId).append("svg")
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`);
        // Nhóm cho các cạnh
        this.edges = this.svg.append('g').attr('class', 'edges');
        // Nhóm cho các trọng số cạnh
        this.weights = this.svg.append('g').attr('class', 'weights');
        // Nhóm cho các đỉnh
        this.nodes = this.svg.append('g').attr('class', 'nodes');
        // Nhóm cho các nhãn
        this.labels = this.svg.append('g').attr('class', 'labels');
    }

    // Cập nhật và vẽ lại đồ thị
    // @param {Graph} graph - Đối tượng đồ thị cần trực quan hóa
    updateGraph(graph) {
        this.graph = graph;

        // Xóa toàn bộ nội dung SVG trước khi vẽ lại
        this.nodes.selectAll('*').remove();
        this.edges.selectAll('*').remove();
        this.weights.selectAll('*').remove();
        this.labels.selectAll('*').remove();

        const vertices = graph.getVertices();
        const edges = graph.getEdges();

        // Chuẩn bị dữ liệu cho đỉnh
        const nodeData = vertices.map(id => {
            const pos = graph.getVertexPosition(id);
            const label = graph.getVertexLabel(id);
            return { id, label, x: pos.x, y: pos.y };
        });

        // Chuẩn bị dữ liệu cho cạnh
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

        // Vẽ các cạnh
        const edgeSelection = this.edges.selectAll('.edge')
            .data(edgeData, d => `${d.source}-${d.target}`);
        edgeSelection.enter()
            .append('line')
            .attr('class', 'edge')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
            .merge(edgeSelection)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2);
        edgeSelection.exit().remove();

        // Vẽ trọng số cạnh
        const weightSelection = this.weights.selectAll('.edge-weight')
            .data(edgeData, d => `${d.source}-${d.target}`);
        weightSelection.enter()
            .append('text')
            .attr('class', 'edge-weight')
            .attr('fill', 'black')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .merge(weightSelection)
            .attr('x', d => (d.x1 + d.x2) / 2)
            .attr('y', d => (d.y1 + d.y2) / 2 - 5)
            .text(d => d.weight === 0 ? '' : d.weight);
        weightSelection.exit().remove();

        // Vẽ các đỉnh
        const nodeSelection = this.nodes.selectAll('.node')
            .data(nodeData, d => d.id);
        nodeSelection.enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 20)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
            .call(d3.drag()
                .on('drag', (event, d) => {
                    // Giới hạn vị trí đỉnh trong canvas
                    d.x = Math.max(20, Math.min(this.width - 20, event.x));
                    d.y = Math.max(20, Math.min(this.height - 20, event.y));
                    this.graph.setVertexPosition(d.id, d.x, d.y);

                    // Cập nhật vị trí đỉnh
                    this.nodes.selectAll('.node')
                        .filter(node => node.id === d.id)
                        .attr('cx', d.x)
                        .attr('cy', d.y);

                    // Cập nhật vị trí nhãn
                    this.labels.selectAll('.label')
                        .filter(label => label.id === d.id)
                        .attr('x', d.x)
                        .attr('y', d.y);

                    // Cập nhật vị trí các cạnh liên quan
                    this.edges.selectAll('.edge')
                        .filter(edge => edge.source === d.id || edge.target === d.id)
                        .attr('x1', edge => edge.source === d.id ? d.x : this.graph.getVertexPosition(edge.source).x)
                        .attr('y1', edge => edge.source === d.id ? d.y : this.graph.getVertexPosition(edge.source).y)
                        .attr('x2', edge => edge.target === d.id ? d.x : this.graph.getVertexPosition(edge.target).x)
                        .attr('y2', edge => edge.target === d.id ? d.y : this.graph.getVertexPosition(edge.target).y);

                    // Cập nhật vị trí trọng số cạnh
                    this.weights.selectAll('.edge-weight')
                        .filter(weight => weight.source === d.id || weight.target === d.id)
                        .attr('x', weight => (this.graph.getVertexPosition(weight.source).x + this.graph.getVertexPosition(weight.target).x) / 2)
                        .attr('y', weight => (this.graph.getVertexPosition(weight.source).y + this.graph.getVertexPosition(weight.target).y) / 2 - 5);
                }))
            .merge(nodeSelection)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // Vẽ nhãn đỉnh
        const labelSelection = this.labels.selectAll('.label')
            .data(nodeData, d => d.id);
        labelSelection.enter()
            .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .merge(labelSelection)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .text(d => d.label);
        labelSelection.exit().remove();

        return { nodeData, edgeData };
    }

    // Làm nổi bật đường đi ngắn nhất
    // @param {number[]} path - Mảng các ID đỉnh trên đường đi
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

        // Làm nổi bật nhãn của các đỉnh trên đường đi
        this.labels.selectAll('.label')
            .filter(d => path.includes(d.id))
            .classed('highlighted-label', true);
    }

    // Xóa các highlight trên đồ thị
    clearHighlights() {
        this.edges.selectAll('.edge').classed('path-edge', false);
        this.nodes.selectAll('.node').classed('highlighted', false);
        this.labels.selectAll('.label').classed('highlighted-label', false);
    }
}

module.exports = GraphVisualizer;