const d3 = require('d3');
const Graph = require('./graph/graph.js');
const GraphVisualizer = require('./visualization/graphVisualizer.js');
const { saveGraphToFile, loadGraphFromFile } = require('./utils/fileUtils.js');
const bfs = require('./algorithms/bfs.js');
const dijkstra = require('./algorithms/dijkstra.js');
const bellmanFord = require('./algorithms/bellmanFord.js');
const floydWarshall = require('./algorithms/floydWarshall.js');
const aStar = require('./algorithms/aStar.js');
const dfs = require('./algorithms/dfs.js');

const canvasContainer = document.querySelector('.canvas-container');
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;

const graph = new Graph();
const visualizer = new GraphVisualizer('#graph-canvas', canvasWidth, canvasHeight);

const modeSelect = document.getElementById('mode-select');
const algorithmSelect = document.getElementById('algorithm-select');
const startNodeSelect = document.getElementById('start-node-select');
const endNodeSelect = document.getElementById('end-node-select');
const runAlgorithmButton = document.getElementById('run-algorithm');
const checkComponentButton = document.getElementById('check-component');
const randomGraphButton = document.getElementById('random-graph');
const clearGraphButton = document.getElementById('clear-graph');
const optionsSelect = document.querySelectorAll('#mode-select')[1];
const messageContent = document.getElementById('contentMessage');
const startToEndNodes = document.getElementById('startToEndNodes');
const cost = document.getElementById('cost');
const path = document.getElementById('path');

let selectedNodesForEdge = [];

function updateNodeDropdowns() {
    startNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh đầu</option>';
    endNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh cuối</option>';

    const vertices = graph.getVertices();
    vertices.forEach(id => {
        const option1 = document.createElement('option');
        option1.value = id;
        let labelStart = graph.getVertexLabel(id);
        option1.textContent = labelStart;
        startNodeSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = id;
        let labelEnd = graph.getVertexLabel(id);
        option2.textContent = labelEnd;
        endNodeSelect.appendChild(option2);
    });
}

function showMessage(message) {
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageContent.innerHTML = formattedMessage;
}

function displayResult(graph, startNode, endNode, pathArray, totalCost) {
    const startLabel = graph.getVertexLabel(startNode);
    const endLabel = graph.getVertexLabel(endNode);

    if (!Array.isArray(pathArray) || pathArray.length === 0) {
        startToEndNodes.textContent = `Không có đường đi từ ${startLabel} đến ${endLabel}.`;
        cost.textContent = 'Chi phí: N/A';
        path.textContent = 'Đường đi: N/A';
        return;
    }

    const pathLabels = pathArray.map(vertex => graph.getVertexLabel(vertex));

    startToEndNodes.textContent = `Đường đi ngắn nhất từ đỉnh ${startLabel} đến đỉnh ${endLabel}:`;
    cost.textContent = `Chi phí: ${totalCost}`;
    path.textContent = `Đường đi: ${pathLabels.join(' -> ')}`;
}

function getPath(predecessors, start, end) {
    const path = [];
    let current = end;
    while (current !== null) {
        path.push(current);
        current = predecessors[current];
    }
    if (path[path.length - 1] !== start) return [];
    return path.reverse();
}

modeSelect.addEventListener('change', (event) => {
    const mode = event.target.value;
    selectedNodesForEdge = [];
    switch (mode) {
        case 'add-node':
            showMessage('Click vào vùng canvas bên dưới đây để thêm đỉnh.');
            break;
        case 'add-edge':
            showMessage('Click vào hai đỉnh để tạo cạnh.');
            break;
        case 'edit-edge':
            showMessage('Click vào đỉnh để chỉnh sửa nhãn, hoặc click vào cạnh để chỉnh sửa trọng số.');
            break;
        case 'delete':
            showMessage('Click vào đỉnh hoặc cạnh để xóa.');
            break;
        case 'move':
            showMessage('Click giữ 1 đỉnh để di chuyển, hoặc click giữ canvas để di chuyển toàn bộ đồ thị.');
            break;
        default:
            showMessage('Chọn một chế độ thao tác để bắt đầu.');
            break;
    }
});

algorithmSelect.addEventListener('change', (event) => {
    const algorithm = event.target.value;
    switch (algorithm) {
        case 'bfs':
            showMessage('Thuật toán BFS: Tìm kiếm theo chiều rộng.' + `\n Hãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.`);
            break;
        case 'dijkstra':
            showMessage('Thuật toán Dijkstra: Tìm đường đi ngắn nhất.' + `\n Hãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.`);
            break;
        case 'bellman-ford':
            showMessage('Thuật toán Bellman-Ford: Tìm đường đi ngắn nhất với trọng số âm.' + `\n Hãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.`);
            break;
        case 'floyd-warshall':
            showMessage('Thuật toán Floyd-Warshall: Tìm đường đi ngắn nhất giữa tất cả các cặp đỉnh.' + `\n Hãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.`);
            break;
        case 'a-star':
            showMessage('Thuật toán A*: Tìm đường đi ngắn nhất với heuristic.' + `\n Hãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.`);
            break;
        default:
            showMessage('Chọn một thuật toán để bắt đầu.');
            break;
    }
});

function generateVertexId(index) {
    if (index < 26) {
        return String.fromCharCode(65 + index);
    } else {
        const firstCharIndex = Math.floor((index - 26) / 26);
        const secondCharIndex = (index - 26) % 26;
        return String.fromCharCode(65 + firstCharIndex) + String.fromCharCode(65 + secondCharIndex);
    }
}

function attachNodeAndEdgeEvents() {
    const weightModal = document.getElementById('weightModal');
    const weightInput = document.getElementById('weightInput');
    const weightOk = document.getElementById('weightOk');
    const weightNoWeight = document.getElementById('weightNoWeight');
    const weightCancel = document.getElementById('weightCancel');
    const labelModal = document.getElementById('labelModal');
    const labelInput = document.getElementById('labelInput');
    const labelOk = document.getElementById('labelOk');
    const labelCancel = document.getElementById('labelCancel');

    const showWeightModal = (currentWeight = 1) => {
        return new Promise((resolve) => {
            weightModal.style.display = 'block';
            weightInput.value = currentWeight;
            weightOk.onclick = () => {
                const weight = parseFloat(weightInput.value);
                weightModal.style.display = 'none';
                resolve(weight);
            };
            weightNoWeight.onclick = () => {
                weightModal.style.display = 'none';
                resolve(0);
            };
            weightCancel.onclick = () => {
                weightModal.style.display = 'none';
                resolve(null);
            };
        });
    };

    const showLabelModal = (currentLabel) => {
        return new Promise((resolve) => {
            labelModal.style.display = 'block';
            labelInput.value = currentLabel;
            labelOk.onclick = () => {
                const newLabel = labelInput.value.trim();
                labelModal.style.display = 'none';
                resolve(newLabel);
            };
            labelCancel.onclick = () => {
                labelModal.style.display = 'none';
                resolve(null);
            };
        });
    };

    window.addEventListener('DOMContentLoaded', () => {
        const svg = d3.select('#graph-canvas');

        svg.on('click', function (event) {
            let [x, y] = d3.pointer(event).map(Math.round);
            const mode = modeSelect.value;

            if (mode === 'add-node') {
                const id = graph.getVertices().length + 1;
                const label = generateVertexId(id - 1);
                graph.addVertex(id, label, x, y);
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
                attachNodeAndEdgeEvents();
                showMessage(`Đỉnh ${label} đã được thêm tại (${x.toFixed(0)}, ${y.toFixed(0)}).`);
            }
        });
    });

    visualizer.nodes.selectAll('.node')
        .on('click', async function (event, d) {
            event.stopPropagation();
            const mode = modeSelect.value;

            if (mode === 'add-edge') {
                selectedNodesForEdge.push(d.id);
                showMessage(`Đã chọn đỉnh ${d.label}. ${selectedNodesForEdge.length === 1 ? 'Chọn đỉnh thứ hai để tạo cạnh.' : ''}`);

                if (selectedNodesForEdge.length === 2) {
                    const [u, v] = selectedNodesForEdge;
                    if (u === v) {
                        showMessage('Không thể tạo cạnh giữa một đỉnh với chính nó.');
                    } else if (graph.hasEdge(u, v)) {
                        showMessage('Cạnh đã tồn tại giữa hai đỉnh này.');
                    } else {
                        const weight = await showWeightModal();
                        if (weight === null) {
                            showMessage('Hủy thêm cạnh.');
                        } else if (isNaN(weight)) {
                            showMessage('Trọng số không hợp lệ, không tạo cạnh.');
                        } else {
                            graph.addEdge(u, v, weight);
                            let labelU = graph.getVertexLabel(u);
                            let labelV = graph.getVertexLabel(v);
                            visualizer.updateGraph(graph);
                            attachNodeAndEdgeEvents();
                            showMessage(`Cạnh từ ${labelU} đến ${labelV} với trọng số ${weight === 0 ? 'không trọng số' : weight} đã được thêm.`);
                        }
                    }
                    selectedNodesForEdge = [];
                }
            } else if (mode === 'delete') {
                graph.removeVertex(d.id);
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
                attachNodeAndEdgeEvents();
                showMessage(`Đỉnh ${d.label} đã được xóa.`);
            } else if (mode === 'edit-edge') {
                const newLabel = await showLabelModal(d.label);
                if (newLabel === null) {
                    showMessage('Hủy chỉnh sửa nhãn đỉnh.');
                } else if (newLabel === '') {
                    showMessage('Nhãn không được để trống.');
                } else {
                    const vertex = graph.getVertexById(d.id);
                    vertex.setLabel(newLabel);
                    visualizer.updateGraph(graph);
                    updateNodeDropdowns();
                    attachNodeAndEdgeEvents();
                    showMessage(`Nhãn của đỉnh ${d.label} đã được đổi thành ${newLabel}.`);
                }
            }
        })
        .call(d3.drag()
            .on('drag', function (event, d) {
                if (modeSelect.value !== 'move') return;
                d.x = Math.max(20, Math.min(visualizer.width - 20, event.x));
                d.y = Math.max(20, Math.min(visualizer.height - 20, event.y));
                graph.setVertexPosition(d.id, d.x, d.y);
                d3.select(this).attr('cx', d.x).attr('cy', d.y);
                visualizer.updateGraph(graph);
                attachNodeAndEdgeEvents();
            }));

    visualizer.edges.selectAll('.edge')
        .on('click', async function (event, d) {
            event.stopPropagation();
            const mode = modeSelect.value;

            if (mode === 'delete') {
                graph.removeEdge(d.source, d.target);
                visualizer.updateGraph(graph);
                attachNodeAndEdgeEvents();
                showMessage(`Cạnh từ ${graph.getVertexLabel(d.source)} đến ${graph.getVertexLabel(d.target)} đã được xóa.`);
            } else if (mode === 'edit-edge') {
                const currentWeight = graph.getEdgeWeight(d.source, d.target);
                const newWeight = await showWeightModal(currentWeight);
                if (newWeight === null) {
                    showMessage('Hủy chỉnh sửa trọng số cạnh.');
                } else if (isNaN(newWeight)) {
                    showMessage('Trọng số không hợp lệ, không cập nhật.');
                } else {
                    graph.setEdgeWeight(d.source, d.target, newWeight);
                    visualizer.updateGraph(graph);
                    attachNodeAndEdgeEvents();
                    showMessage(`Cạnh từ ${graph.getVertexLabel(d.source)} đến ${graph.getVertexLabel(d.target)} đã được cập nhật trọng số thành ${newWeight === 0 ? 'không trọng số' : newWeight}.`);
                }
            }
        });

    const svg = d3.select('#graph-canvas');
    svg.call(d3.drag()
        .on('start', function () {
            if (modeSelect.value !== 'move') return;
            d3.select(this).style('cursor', 'grabbing');
        })
        .on('drag', function (event) {
            if (modeSelect.value !== 'move') return;
            const dx = event.dx;
            const dy = event.dy;
            graph.getVertices().forEach(id => {
                const pos = graph.getVertexPosition(id);
                const newX = Math.max(20, Math.min(visualizer.width - 20, pos.x + dx));
                const newY = Math.max(20, Math.min(visualizer.height - 20, pos.y + dy));
                graph.setVertexPosition(id, newX, newY);
            });
            visualizer.updateGraph(graph);
            attachNodeAndEdgeEvents();
        })
        .on('end', function () {
            if (modeSelect.value !== 'move') return;
            d3.select(this).style('cursor', 'default');
        }));
}

runAlgorithmButton.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    const startNode = parseInt(startNodeSelect.value); // Chuyển chuỗi thành số
    const endNode = parseInt(endNodeSelect.value); // Chuyển chuỗi thành số
    // const startNode = startNodeSelect.value;
    // const endNode = endNodeSelect.value;
    console.log('startNode', typeof startNode, startNode);
    console.log('endNode', typeof endNode, endNode);

    // Kiểm tra điều kiện cơ bản
    if (algorithm === 'default') {
        showMessage('Vui lòng chọn thuật toán.');
        return;
    }
    if (isNaN(startNode) || isNaN(endNode)) {
        showMessage('Vui lòng chọn đỉnh đầu và đỉnh cuối hợp lệ.');
        return;
    }

    // Lấy danh sách cạnh và đỉnh để kiểm tra
    const edges = graph.getEdges();
    const vertices = graph.getVertices();

    // Kiểm tra trước khi chạy thuật toán
    if (algorithm === 'bfs') {
        const hasInvalidWeightForBFS = edges.some(edge => edge.w !== 0 && edge.w !== 1);
        if (hasInvalidWeightForBFS) {
            showMessage('BFS chỉ tìm đường đi ngắn nhất theo số cạnh, không tính trọng số.');
            return;
        }
    } else if (algorithm === 'dijkstra') {
        const hasNegativeWeight = edges.some(edge => edge.w < 0);
        if (hasNegativeWeight) {
            showMessage('Lỗi: Thuật toán Dijkstra không hỗ trợ trọng số âm.');
            return;
        }
    } else if (algorithm === 'a-star') {
        // Kiểm tra trọng số âm
        const hasNegativeWeight = edges.some(edge => edge.w < 0);
        if (hasNegativeWeight) {
            showMessage('Thuật toán A* không hỗ trợ trọng số âm.');
            return;
        }
        // Kiểm tra tọa độ hợp lệ
        const hasInvalidPosition = vertices.some(vertex => {
            const pos = graph.getVertexPosition(vertex);
            return pos === null || isNaN(pos.x) || isNaN(pos.y);
        });
        if (hasInvalidPosition) {
            showMessage('Đồ thị có đỉnh không có tọa độ hợp lệ, không thể chạy thuật toán A*.');
            return;
        }
    }

    // Chạy thuật toán
    let result = null;
    try {
        switch (algorithm) {
            case 'bfs':
                result = bfs(graph, startNode);
                console.log('BFS Result:', result);
                break;
            case 'dijkstra':
                result = dijkstra(graph, startNode);
                console.log('Dijkstra Result:', result);
                break;
            case 'bellman-ford':
                result = bellmanFord(graph, startNode);
                console.log('Bellman-Ford Result:', result);
                break;
            case 'floyd-warshall':
                const fwResult = floydWarshall(graph);
                const vertexIndex = fwResult.vertexIndex;
                const startIdx = vertexIndex.get(startNode);
                const endIdx = vertexIndex.get(endNode);
                const distancesMatrix = fwResult.distances;
                const predecessorsMatrix = fwResult.predecessors;
                const distances = {};
                const predecessors = {};
                graph.getVertices().forEach(v => {
                    const idx = vertexIndex.get(v);
                    distances[v] = distancesMatrix.get(startIdx, idx);
                    predecessors[v] = predecessorsMatrix.get(startIdx, idx);
                });
                result = { distances, predecessors };
                console.log('Floyd-Warshall Result:', result);
                break;
            case 'a-star':
                result = aStar(graph, startNode, endNode);
                console.log('A* Result:', result);
                break;
        }

        const path = getPath(result.predecessors, startNode, endNode);
        console.log('path', path);
        const totalCost = result.distances[endNode] === Infinity ? 'N/A' : result.distances[endNode];
        displayResult(graph, startNode, endNode, path, totalCost);
        if (path.length > 0) {
            visualizer.highlightPath(path);
        } else {
            visualizer.clearHighlights();
        }
    } catch (error) {
        console.error('Error running algorithm:', error);
        if (error.message === "Graph contains a negative-weight cycle") {
            showMessage('Lỗi: Đồ thị có chu trình âm. Thuật toán không thể tìm đường đi ngắn nhất.');
        } else {
            showMessage(`Lỗi: ${error.message}`);
        }
        visualizer.clearHighlights();
    }
});

checkComponentButton.addEventListener('click', () => {
    const { count, components } = dfs(graph);
    // console.log(graph.getNeighbors(3));

    const message = `Số thành phần liên thông: ${count}\n` +
        components.map((comp, idx) =>
            `Thành phần ${idx + 1}: ${comp.map(vertex => graph.getVertexLabel(vertex)).join(', ')}`
        ).join('\n');

    showMessage(message);
    visualizer.clearHighlights();
});

randomGraphButton.addEventListener('click', () => {
    graph.vertices = [];
    graph.edges = [];
    const numVertices = Math.floor(Math.random() * 7) + 4;
    const vertexIds = [];
    for (let i = 0; i < numVertices; i++) {
        const id = i + 1;
        vertexIds.push(id);
        const label = generateVertexId(i);
        const x = Math.floor(Math.random() * (canvasWidth - 100)) + 50;
        const y = Math.floor(Math.random() * (canvasHeight - 100)) + 50;
        graph.addVertex(id, label, x, y);
    }
    const maxEdges = (numVertices * (numVertices - 1)) / 2;
    const numEdges = Math.floor(Math.random() * (maxEdges - 1)) + 1;
    const addedEdges = new Set();
    for (let i = 0; i < numEdges; i++) {
        let u, v;
        let edgeKey;
        do {
            u = vertexIds[Math.floor(Math.random() * numVertices)];
            v = vertexIds[Math.floor(Math.random() * numVertices)];
            edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
        } while (u === v || addedEdges.has(edgeKey));
        addedEdges.add(edgeKey);
        const weight = Math.floor(Math.random() * 10) + 1;
        graph.addEdge(u, v, weight);
    }
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    if (vertexIds.length > 0) {
        startNodeSelect.value = vertexIds[0].toString();
        endNodeSelect.value = vertexIds[vertexIds.length - 1].toString();
    }
    attachNodeAndEdgeEvents();
    showMessage(`Đồ thị ngẫu nhiên đã được tạo: ${numVertices} đỉnh, ${numEdges} cạnh.`);
});

clearGraphButton.addEventListener('click', () => {
    graph.vertices = [];
    graph.edges = [];
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    attachNodeAndEdgeEvents();
    showMessage('Đồ thị đã được xóa.');
    visualizer.clearHighlights();
});

optionsSelect.addEventListener('change', async (event) => {
    const option = event.target.value;

    switch (option) {
        case 'export':
            const saveSuccess = await saveGraphToFile(graph);
            showMessage(saveSuccess ? 'Đồ thị đã được xuất thành file JSON.' : 'Xuất file thất bại.');
            break;
        case 'import':
            const loadedGraphData = await loadGraphFromFile();
            if (loadedGraphData) {
                const loadedGraph = Graph.fromJSON(loadedGraphData); // Sử dụng Graph.fromJSON
                graph.vertices = loadedGraph.vertices;
                graph.edges = loadedGraph.edges;
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
                attachNodeAndEdgeEvents();
                showMessage('Đồ thị đã được nhập từ file JSON.');
            } else {
                showMessage('Nhập file thất bại hoặc bị hủy.');
            }
            break;
        case 'image':
            const svg = document.querySelector('#graph-canvas');
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            const link = document.createElement('a');
            link.download = 'graph.svg';
            link.href = svgUrl;
            link.click();
            showMessage('Đồ thị đã được xuất thành tệp SVG.');
            setTimeout(() => URL.revokeObjectURL(svgUrl), 100); // Giải phóng URL
            break;
        case 'dataStructure':
            const graphData = graph.toJSON();
            if (!graphData || !Array.isArray(graphData.vertices) || !Array.isArray(graphData.edges)) {
                showMessage('Lỗi: Dữ liệu đồ thị không hợp lệ.');
                break;
            }
            const V = graphData.vertices.length;
            const E = graphData.edges.length;
            const message = `Đồ thị có ${V} đỉnh và ${E} cạnh như sau:\n` +
                `Đỉnh:\n${graphData.vertices.map(v => v.label).join(',')},\n` +
                `Cạnh:\n${graphData.edges.map(e => `(${graph.getVertexLabel(e.u)} - ${graph.getVertexLabel(e.v)}, ${e.w})`).join('\n')}`;
            showMessage(message);
            break;
    }

    event.target.value = "default";
});

window.addEventListener('resize', () => {
    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;
    visualizer.width = newWidth;
    visualizer.height = newHeight;
    visualizer.svg.attr('viewBox', `0 0 ${newWidth} ${newHeight}`);
    visualizer.updateGraph(graph);
    attachNodeAndEdgeEvents();
});

function init() {
    graph.addVertex(1, 'A', 100, 100);
    graph.addVertex(2, 'B', 200, 200);
    graph.addVertex(3, 'C', 350, 250);
    graph.addVertex(4, 'D', 400, 100);
    graph.addVertex(5, 'E', 500, 200);
    graph.addVertex(6, 'F', 600, 300);
    graph.addVertex(7, 'H', 354, 376);
    graph.addVertex(8, 'G', 100, 300);

    graph.addEdge(1, 2, 5);
    graph.addEdge(2, 3, 9);
    graph.addEdge(3, 4, 3);
    graph.addEdge(4, 5, 7);
    graph.addEdge(3, 6, 1);
    graph.addEdge(3, 8, 4);
    graph.addEdge(7, 6, 2);

    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    attachNodeAndEdgeEvents();
    showMessage('<p>Chọn các chức năng ở bảng bên trái để bắt đầu thao tác với đồ thị.</p>');
}

init();