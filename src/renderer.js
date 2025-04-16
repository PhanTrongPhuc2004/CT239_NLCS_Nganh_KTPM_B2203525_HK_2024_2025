import { Graph } from './graph/graph.js';
var data = {
    "nodes": [
        { "id": 0, "label": "A", "x": 100, "y": 150 },
        { "id": 1, "label": "B", "x": 200, "y": 250 },
        { "id": 2, "label": "C", "x": 300, "y": 150 },
        { "id": 3, "label": "D", "x": 300, "y": 300 }
    ],
    "links": [
        { "source": 0, "target": 1, "weight": 5 },
        { "source": 0, "target": 2, "weight": 2 },
        { "source": 1, "target": 2, "weight": 3 },
        { "source": 2, "target": 0, "weight": 1 },
        { "source": 2, "target": 3, "weight": 7 }
    ]
};

const container = d3.select("#graph-canvas");
const width = container.node().getBoundingClientRect().width;
const height = container.node().getBoundingClientRect().height;

const svg = container.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
// .attr("preserveAspectRatio", "xMidYMid meet");

// Vẽ links (cạnh)
const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("x1", d => data.nodes[d.source].x)
    .attr("y1", d => data.nodes[d.source].y)
    .attr("x2", d => data.nodes[d.target].x)
    .attr("y2", d => data.nodes[d.target].y)
    .attr("stroke", "black")
    .attr("stroke-width", 3);

// Vẽ các nodes với khả năng kéo thả
const node = svg.append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 20)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// Vẽ labels cho các node
const text = svg.append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter().append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text(d => d.label);

// Định nghĩa hàm xử lý sự kiện kéo thả
function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}


function dragged(event, d) {
    // Cập nhật vị trí node
    d.x = event.x;
    d.y = event.y;

    // Cập nhật vị trí hiển thị của node
    d3.select(this).attr("cx", d.x).attr("cy", d.y)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 3);

    // Cập nhật vị trí của text (nếu có)
    svg.selectAll("text")
        .filter(function (text_d) { return text_d.id === d.id; })
        .attr("x", d.x)
        .attr("y", d.y);

    // Cập nhật vị trí của các cạnh liên quan
    link
        .filter(function (link_d) { return link_d.source === d || link_d.target === d; })
        .attr("x1", function (link_d) { return data.nodes[link_d.source.id || link_d.source].x; })
        .attr("y1", function (link_d) { return data.nodes[link_d.source.id || link_d.source].y; })
        .attr("x2", function (link_d) { return data.nodes[link_d.target.id || link_d.target].x; })
        .attr("y2", function (link_d) { return data.nodes[link_d.target.id || link_d.target].y; });
}

function dragended(event, d) {
    d3.select(this).attr("stroke", "black");
}

function dragged(event, d) {
    // Cập nhật vị trí node
    d.x = event.x;
    d.y = event.y;

    // Cập nhật vị trí hiển thị của node
    d3.select(this).attr("cx", d.x).attr("cy", d.y);

    // Cập nhật vị trí của text
    svg.selectAll("text")
        .filter(function (text_d) { return text_d.id === d.id; })
        .attr("x", d.x)
        .attr("y", d.y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")

    // Cập nhật vị trí của các cạnh liên quan
    link
        .attr("x1", function (link_d) {
            const source = typeof link_d.source === 'object' ? link_d.source : data.nodes[link_d.source];
            return source.x;
        })
        .attr("y1", function (link_d) {
            const source = typeof link_d.source === 'object' ? link_d.source : data.nodes[link_d.source];
            return source.y;
        })
        .attr("x2", function (link_d) {
            const target = typeof link_d.target === 'object' ? link_d.target : data.nodes[link_d.target];
            return target.x;
        })
        .attr("y2", function (link_d) {
            const target = typeof link_d.target === 'object' ? link_d.target : data.nodes[link_d.target];
            return target.y;
        });
}