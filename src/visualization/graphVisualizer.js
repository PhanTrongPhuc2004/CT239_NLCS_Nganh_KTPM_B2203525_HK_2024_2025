const d3 = require('d3');

// Đồ thị trực quan hóa
class GraphVisualizer {
    constructor(svgId, width, height, graph) {
        this.width = width;
        this.height = height;
        this.graph = graph; // Lưu tham chiếu đến graph để cập nhật vị trí
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

    // Cập nhật và vẽ đồ thị
    updateGraph(graph) {
        this.graph = graph;

        // Xóa toàn bộ nội dung SVG trước khi vẽ lại
        this.nodes.selectAll('*').remove();  // Xóa tất cả đỉnh
        this.edges.selectAll('*').remove(); // Xóa tất cả cạnh
        this.weights.selectAll('*').remove(); // Xóa tất cả trọng số
        this.labels.selectAll('*').remove(); // Xóa tất cả nhãn

        const vertices = graph.getVertices();
        const edges = graph.getEdges();

        // Dữ liệu cho đỉnh
        const nodeData = vertices.map(id => {
            const pos = graph.getVertexPosition(id);
            const label = graph.getVertexLabel(id);
            return { id, label, x: pos.x, y: pos.y };
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
            .text(d => d.weight);

        weightSelection.exit().remove();

        // Vẽ đỉnh
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
                    d.x = Math.max(20, Math.min(this.width - 20, event.x));
                    d.y = Math.max(20, Math.min(this.height - 20, event.y));
                    this.graph.setVertexPosition(d.id, d.x, d.y);
                    d3.select(event.subject).attr('cx', d.x).attr('cy', d.y);
                    this.labels.selectAll('.label')
                        .filter(label => label.id === d.id)
                        .attr('x', d.x)
                        .attr('y', d.y);
                    this.edges.selectAll('.edge')
                        .filter(edge => edge.source === d.id || edge.target === d.id)
                        .attr('x1', edge => edge.source === d.id ? d.x : this.graph.getVertexPosition(edge.source).x)
                        .attr('y1', edge => edge.source === d.id ? d.y : this.graph.getVertexPosition(edge.source).y)
                        .attr('x2', edge => edge.target === d.id ? d.x : this.graph.getVertexPosition(edge.target).x)
                        .attr('y2', edge => edge.target === d.id ? d.y : this.graph.getVertexPosition(edge.target).y);
                    this.weights.selectAll('.edge-weight')
                        .filter(weight => weight.source === d.id || weight.target === d.id)
                        .attr('x', weight => (this.graph.getVertexPosition(weight.source).x + this.graph.getVertexPosition(weight.target).x) / 2)
                        .attr('y', weight => (this.graph.getVertexPosition(weight.source).y + this.graph.getVertexPosition(weight.target).y) / 2 - 5);
                }))
            .merge(nodeSelection)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        nodeSelection.exit().remove();

        // Vẽ nhãn
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

    // Xóa các highlight
    clearHighlights() {
        this.edges.selectAll('.edge').classed('path-edge', false);
        this.nodes.selectAll('.node').classed('highlighted', false);
        this.labels.selectAll('.label').classed('highlighted-label', false);
    }
}

module.exports = GraphVisualizer;