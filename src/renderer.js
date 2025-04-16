
// var data = {
//     "nodes": [
//         { "id": 0, "label": "A", "x": 50, "y": 50 },
//         { "id": 1, "label": "B", "x": 200, "y": 250 },
//         { "id": 2, "label": "C", "x": 300, "y": 150 },
//         { "id": 3, "label": "D", "x": 300, "y": 300 }
//     ],
//     "links": [
//         { "source": 0, "target": 1, "weight": 5 },
//         { "source": 0, "target": 2, "weight": 2 },
//         { "source": 1, "target": 2, "weight": 3 },
//         { "source": 2, "target": 0, "weight": 1 },
//         { "source": 2, "target": 3, "weight": 7 }
//     ]
// };

// const container = d3.select("#graph-canvas");
// const width = container.node().getBoundingClientRect().width;
// const height = container.node().getBoundingClientRect().height;

// const svg = container.append("svg")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("viewBox", `0 0 ${width} ${height}`)
// // .attr("preserveAspectRatio", "xMidYMid meet");

// // Vẽ links (cạnh)
// const link = svg.append("g")
//     .selectAll("line")
//     .data(data.links)
//     .enter().append("line")
//     .attr("x1", d => data.nodes[d.source].x)
//     .attr("y1", d => data.nodes[d.source].y)
//     .attr("x2", d => data.nodes[d.target].x)
//     .attr("y2", d => data.nodes[d.target].y)
//     .attr("stroke", "black")
//     .attr("stroke-width", 3);

// // Vẽ các nodes với khả năng kéo thả
// const node = svg.append("g")
//     .selectAll("circle")
//     .data(data.nodes)
//     .enter().append("circle")
//     .attr("cx", d => d.x)
//     .attr("cy", d => d.y)
//     .attr("r", 20)
//     .attr("fill", "white")
//     .attr("stroke", "black")
//     .attr("stroke-width", 3)
//     .call(d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended));

// // Vẽ labels cho các node
// const text = svg.append("g")
//     .selectAll("text")
//     .data(data.nodes)
//     .enter().append("text")
//     .attr("x", d => d.x)
//     .attr("y", d => d.y)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "central")
//     .text(d => d.label);

// // Định nghĩa hàm xử lý sự kiện kéo thả
// function dragstarted(event, d) {
//     d3.select(this).raise().attr("stroke", "black");
// }


// function dragged(event, d) {
//     // Cập nhật vị trí node
//     d.x = event.x;
//     d.y = event.y;

//     // Cập nhật vị trí hiển thị của node
//     d3.select(this).attr("cx", d.x).attr("cy", d.y)
//         .attr("fill", "white")
//         .attr("stroke", "black")
//         .attr("stroke-width", 3);

//     // Cập nhật vị trí của text (nếu có)
//     svg.selectAll("text")
//         .filter(function (text_d) { return text_d.id === d.id; })
//         .attr("x", d.x)
//         .attr("y", d.y);

//     // Cập nhật vị trí của các cạnh liên quan
//     link
//         .filter(function (link_d) { return link_d.source === d || link_d.target === d; })
//         .attr("x1", function (link_d) { return data.nodes[link_d.source.id || link_d.source].x; })
//         .attr("y1", function (link_d) { return data.nodes[link_d.source.id || link_d.source].y; })
//         .attr("x2", function (link_d) { return data.nodes[link_d.target.id || link_d.target].x; })
//         .attr("y2", function (link_d) { return data.nodes[link_d.target.id || link_d.target].y; });
// }

// function dragended(event, d) {
//     d3.select(this).attr("stroke", "black");
// }

// function dragged(event, d) {
//     // Cập nhật vị trí node
//     d.x = event.x;
//     d.y = event.y;

//     // Cập nhật vị trí hiển thị của node
//     d3.select(this).attr("cx", d.x).attr("cy", d.y);

//     // Cập nhật vị trí của text
//     svg.selectAll("text")
//         .filter(function (text_d) { return text_d.id === d.id; })
//         .attr("x", d.x)
//         .attr("y", d.y)
//         .attr("text-anchor", "middle")
//         .attr("dominant-baseline", "central")

//     // Cập nhật vị trí của các cạnh liên quan
//     link
//         .attr("x1", function (link_d) {
//             const source = typeof link_d.source === 'object' ? link_d.source : data.nodes[link_d.source];
//             return source.x;
//         })
//         .attr("y1", function (link_d) {
//             const source = typeof link_d.source === 'object' ? link_d.source : data.nodes[link_d.source];
//             return source.y;
//         })
//         .attr("x2", function (link_d) {
//             const target = typeof link_d.target === 'object' ? link_d.target : data.nodes[link_d.target];
//             return target.x;
//         })
//         .attr("y2", function (link_d) {
//             const target = typeof link_d.target === 'object' ? link_d.target : data.nodes[link_d.target];
//             return target.y;
//         });
// }



// const Graph = require('./graph/graph.js');

// // Tạo một đồ thị .mới
// const graph = new Graph();

// // Thêm đỉnh
// graph.addVertex(1, "A", 100, 100);
// graph.addVertex(2, "B", 200, 200);
// graph.addVertex(3, "C", 300, 100);

// // Thêm cạnh
// graph.addEdge(1, 2, 5); // Cạnh giữa A và B, trọng số 5
// graph.addEdge(2, 3, -2); // Cạnh giữa B và C, trọng số -2

// // Lấy danh sách đỉnh kề của đỉnh 2
// const neighbors = graph.getNeighbors(2);
// console.log(neighbors); // [{id: 1, weight: 5}, {id: 3, weight: -2}]

// // Lưu đồ thị thành JSON
// const graphJSON = graph.toJSON();
// console.log(graphJSON);

// // Tải đồ thị từ JSON
// const newGraph = Graph.fromJSON(graphJSON);

// // Cập nhật tọa độ đỉnh (khi kéo thả bằng D3.js)
// graph.updateVertexPosition(1, 150, 150);

// const Stack = require('./dataStructures/stack.js');
// const Queue = require( './dataStructures/queue.js');
// const PriorityQueue = require( './dataStructures/priorityQueue.js');
// const Matrix = require( './dataStructures/matrix.js');

// // Ví dụ sử dụng Stack (cho DFS)
// const stack = new Stack();
// stack.push(1);
// stack.push(2);
// console.log(stack.pop()); // 2
// console.log(stack.peek()); // 1
// console.log(stack.isEmpty()); // false

// // Ví dụ sử dụng Queue (cho BFS)
// const queue = new Queue();
// queue.enqueue(1);
// queue.enqueue(2);
// console.log(queue.dequeue()); // 1
// console.log(queue.front()); // 2
// console.log(queue.isEmpty()); // false

// // Ví dụ sử dụng PriorityQueue (cho Dijkstra/A*)
// const pq = new PriorityQueue();
// pq.enqueue(1, 5); // Đỉnh 1, khoảng cách 5
// pq.enqueue(2, 3); // Đỉnh 2, khoảng cách 3
// console.log(pq.dequeue()); // 2 (vì khoảng cách 3 nhỏ hơn)
// console.log(pq.isEmpty()); // false

// // Ví dụ sử dụng Matrix (cho Floyd-Warshall)
// const matrix = new Matrix(3); // Ma trận 3x3, mặc định giá trị là Infinity
// matrix.set(0, 1, 4); // Đặt khoảng cách từ đỉnh 0 đến đỉnh 1 là 4
// console.log(matrix.get(0, 1)); // 4
// console.log(matrix.get(0, 0)); // Infinity
// console.log(matrix.getSize()); // 3



// const bfs = require('./algorithms/bfs.js');
// const dfs = require('./algorithms/dfs.js');
// const dijkstra = require('./algorithms/dijkstra.js');
// const bellmanFord = require('./algorithms/bellmanFord.js');
// const floydWarshall = require('./algorithms/floydWarshall.js');
// const aStar = require('./algorithms/aStar.js');
// const Graph = require('./graph/graph.js');

// // Giả sử bạn có một đối tượng graph từ src/graph/graph.js
// const graph = new Graph(); // Cần triển khai Graph class

// // Sử dụng BFS
// const startVertex = 'A';
// const bfsResult = bfs(graph, startVertex);
// console.log('BFS Distances:', bfsResult.distances);
// console.log('BFS Predecessors:', bfsResult.predecessors);

// // Sử dụng DFS
// const dfsResult = dfs(graph);
// console.log('DFS Number of Components:', dfsResult.count);
// console.log('DFS Components:', dfsResult.components);

// // Sử dụng Dijkstra
// const dijkstraResult = dijkstra(graph, startVertex);
// console.log('Dijkstra Distances:', dijkstraResult.distances);
// console.log('Dijkstra Predecessors:', dijkstraResult.predecessors);

// // Sử dụng Bellman-Ford
// try {
//     const bellmanFordResult = bellmanFord(graph, startVertex);
//     console.log('Bellman-Ford Distances:', bellmanFordResult.distances);
//     console.log('Bellman-Ford Predecessors:', bellmanFordResult.predecessors);
// } catch (error) {
//     console.error(error.message); // Chu trình âm
// }

// // Sử dụng Floyd-Warshall
// try {
//     const floydWarshallResult = floydWarshall(graph);
//     console.log('Floyd-Warshall Distances:', floydWarshallResult.distances);
//     console.log('Floyd-Warshall Predecessors:', floydWarshallResult.predecessors);
// } catch (error) {
//     console.error(error.message); // Chu trình âm
// }

// // Sử dụng A*
// const endVertex = 'B';
// const aStarResult = aStar(graph, startVertex, endVertex);
// console.log('A* Distances:', aStarResult.distances);
// console.log('A* Predecessors:', aStarResult.predecessors);




// const GraphVisualizer = require('./visualization/graphVisualizer.js');
// const Graph = require('./graph/graph.js');

// // Khởi tạo visualizer
// const visualizer = new GraphVisualizer('#graph-canvas', 800, 600);

// // Cập nhật đồ thị
// const graph = new Graph(); // Giả sử bạn đã có Graph class
// visualizer.updateGraph(graph);

// // Làm nổi bật đường đi ngắn nhất
// const path = ['A', 'B', 'C']; // Đường đi từ thuật toán
// visualizer.highlightPath(path);

// // Làm nổi bật các đỉnh đã thăm
// const visitedVertices = ['A', 'D'];
// visualizer.highlightVisited(visitedVertices);

// // Xóa highlight
// visualizer.clearHighlights();



const Graph = require('./graph/graph.js');
const { saveGraphToFile, loadGraphFromFile } = require('./utils/fileUtils.js');

// Tạo một đồ thị
const graph = new Graph();
graph.addVertex('A', 100, 100);
graph.addVertex('B', 200, 200);
graph.addEdge('A', 'B', 5);

// Lưu đồ thị
saveGraphToFile(graph, 'graph.json');

// Mở đồ thị
const graphData = loadGraphFromFile('graph.json');
if (graphData) {
    console.log('Loaded graph:', graphData);
    // Tái tạo đồ thị
    const newGraph = new Graph();
    graphData.vertices.forEach(vertex => {
        newGraph.addVertex(vertex.id, vertex.x, vertex.y);
    });
    graphData.edges.forEach(edge => {
        newGraph.addEdge(edge.u, edge.v, edge.w);
    });
}