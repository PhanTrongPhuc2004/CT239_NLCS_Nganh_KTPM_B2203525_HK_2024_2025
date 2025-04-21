/* === Nhập các module cần thiết === */
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

/* === Khởi tạo biến toàn cục === */
// Lấy container canvas và kích thước
const canvasContainer = document.querySelector('.canvas-container');
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;

// Khởi tạo đối tượng đồ thị và trình trực quan hóa
const graph = new Graph();
const visualizer = new GraphVisualizer('#graph-canvas', canvasWidth, canvasHeight);

// Lấy các phần tử giao diện
const modeSelect = document.getElementById('mode-select');
const algorithmSelect = document.getElementById('algorithm-select');
const startNodeSelect = document.getElementById('start-node-select');
const endNodeSelect = document.getElementById('end-node-select');
const runAlgorithmButton = document.getElementById('run-algorithm');
const checkComponentButton = document.getElementById('check-component');
const randomGraphButton = document.getElementById('random-graph');
const clearGraphButton = document.getElementById('clear-graph');
const optionsSelect = document.getElementById('options-select');
const messageContent = document.getElementById('contentMessage');
const startToEndNodes = document.getElementById('startToEndNodes');
const cost = document.getElementById('cost');
const path = document.getElementById('path');

// Biến lưu trữ trạng thái
let currentGraphId = null; // ID đồ thị hiện tại
let selectedNodesForEdge = []; // Lưu các đỉnh được chọn để tạo cạnh
let lastAlgorithmResult = null; // Lưu kết quả thuật toán gần nhất

/* === Hàm tiện ích === */
/**
 * Hiển thị thông báo trên giao diện
 * @param {string} message - Thông báo cần hiển thị
 */
function showMessage(message) {
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageContent.innerHTML = formattedMessage;
}

/**
 * Cập nhật danh sách các đỉnh trong dropdown chọn đỉnh đầu và cuối
 */
function updateNodeDropdowns() {
    startNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh đầu</option>';
    endNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh cuối</option>';

    const vertices = graph.getVertices();
    vertices.forEach(id => {
        const label = graph.getVertexLabel(id);
        const option1 = document.createElement('option');
        option1.value = id;
        option1.textContent = label;
        startNodeSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = id;
        option2.textContent = label;
        endNodeSelect.appendChild(option2);
    });
}

/**
 * Tạo ID cho đỉnh dựa trên chỉ số
 * @param {number} index - Chỉ số của đỉnh
 * @returns {string} - ID dạng chữ cái (A, B, ..., AA, AB, ...)
 */
function generateVertexId(index) {
    if (index < 26) {
        return String.fromCharCode(65 + index);
    } else {
        const firstCharIndex = Math.floor((index - 26) / 26);
        const secondCharIndex = (index - 26) % 26;
        return String.fromCharCode(65 + firstCharIndex) + String.fromCharCode(65 + secondCharIndex);
    }
}

/**
 * Tự động bố trí đồ thị theo lưới
 */
function autoLayoutGraph() {
    const vertices = graph.getVertices();
    const n = vertices.length;
    if (n === 0) return;

    const gridSize = Math.ceil(Math.sqrt(n));
    const cellWidth = canvasWidth / (gridSize + 1);
    const cellHeight = canvasHeight / (gridSize + 1);

    vertices.forEach((id, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = (col + 1) * cellWidth;
        const y = (row + 1) * cellHeight;
        graph.setVertexPosition(id, x, y);
    });

    visualizer.updateGraph(graph);
    showMessage('Đã tự động bố trí đồ thị.');
}

/* === Hàm quản lý đồ thị === */
/**
 * Lưu đồ thị vào localStorage
 * @param {string} name - Tên đồ thị
 * @param {Graph} graph - Đối tượng đồ thị
 * @returns {string} - ID của đồ thị
 */
function saveGraphToStorage(name, graph) {
    const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
    const graphId = Date.now().toString();
    graphs[graphId] = { name, data: graph.toJSON() };
    localStorage.setItem('graphs', JSON.stringify(graphs));
    return graphId;
}

/**
 * Tải danh sách đồ thị từ localStorage và cập nhật dropdown
 */
function loadGraphList() {
    const graphList = document.getElementById('graph-list');
    graphList.innerHTML = '<option value="default" selected hidden>Chọn đồ thị</option>';
    const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
    Object.entries(graphs).forEach(([id, { name }]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        graphList.appendChild(option);
    });
}

/**
 * Tải đồ thị từ localStorage
 * @param {string} graphId - ID của đồ thị
 */
function loadGraphFromStorage(graphId) {
    const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
    const graphData = graphs[graphId]?.data;
    if (graphData) {
        const loadedGraph = Graph.fromJSON(graphData);
        graph.vertices = loadedGraph.vertices;
        graph.edges = loadedGraph.edges;
        visualizer.updateGraph(graph);
        updateNodeDropdowns();
        attachNodeAndEdgeEvents();
        currentGraphId = graphId;
        showMessage(`Đã tải đồ thị: ${graphs[graphId].name}`);
    } else {
        showMessage('Không tìm thấy đồ thị.');
    }
}

/**
 * Xóa đồ thị khỏi localStorage
 * @param {string} graphId - ID của đồ thị
 */
function deleteGraphFromStorage(graphId) {
    const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
    if (graphs[graphId]) {
        delete graphs[graphId];
        localStorage.setItem('graphs', JSON.stringify(graphs));
        loadGraphList();
        if (currentGraphId === graphId) {
            graph.vertices = [];
            graph.edges = [];
            visualizer.updateGraph(graph);
            updateNodeDropdowns();
            currentGraphId = null;
            showMessage('Đồ thị đã được xóa.');
        }
    }
}

/* === Hàm hiển thị modal === */
/**
 * Hiển thị modal để nhập tên đồ thị
 * @returns {Promise<string|null>} - Tên đồ thị hoặc null nếu hủy
 */
function showSaveGraphModal() {
    return new Promise((resolve) => {
        const saveGraphModal = document.getElementById('saveGraphModal');
        const graphNameInput = document.getElementById('graphNameInput');
        const saveGraphOk = document.getElementById('saveGraphOk');
        const saveGraphCancel = document.getElementById('saveGraphCancel');

        saveGraphModal.style.display = 'block';
        graphNameInput.value = '';
        saveGraphOk.onclick = () => {
            const name = graphNameInput.value.trim();
            saveGraphModal.style.display = 'none';
            resolve(name);
        };
        saveGraphCancel.onclick = () => {
            saveGraphModal.style.display = 'none';
            resolve(null);
        };
    });
}

/**
 * Hiển thị modal để nhập ma trận trọng số
 * @returns {Promise<string|null>} - Ma trận trọng số hoặc null nếu hủy
 */
function showMatrixInputModal() {
    return new Promise((resolve) => {
        const matrixInputModal = document.getElementById('matrixInputModal');
        const matrixInput = document.getElementById('matrixInput');
        const matrixOk = document.getElementById('matrixOk');
        const matrixCancel = document.getElementById('matrixCancel');

        matrixInputModal.style.display = 'block';
        matrixInput.value = '';
        matrixOk.onclick = () => {
            const matrixText = matrixInput.value.trim();
            matrixInputModal.style.display = 'none';
            resolve(matrixText);
        };
        matrixCancel.onclick = () => {
            matrixInputModal.style.display = 'none';
            resolve(null);
        };
    });
}

/**
 * Hiển thị modal để xem ma trận kết quả
 * @param {string} matrixText - Nội dung ma trận
 */
function showResultMatrixModal(matrixText) {
    const resultMatrixModal = document.getElementById('resultMatrixModal');
    const resultMatrixOutput = document.getElementById('resultMatrixOutput');
    const resultMatrixOk = document.getElementById('resultMatrixOk');

    resultMatrixModal.style.display = 'block';
    resultMatrixOutput.textContent = matrixText;
    resultMatrixOk.onclick = () => {
        resultMatrixModal.style.display = 'none';
    };
}

/* === Hàm xử lý thuật toán === */
/**
 * Hiển thị kết quả thuật toán
 * @param {Graph} graph - Đối tượng đồ thị
 * @param {number} startNode - Đỉnh đầu
 * @param {number} endNode - Đỉnh cuối
 * @param {number[]} pathArray - Mảng các đỉnh trên đường đi
 * @param {number|string} totalCost - Chi phí đường đi
 */
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

/**
 * Lấy đường đi từ đỉnh đầu đến đỉnh cuối
 * @param {Object} predecessors - Đối tượng chứa đỉnh trước đó
 * @param {number} start - Đỉnh đầu
 * @param {number} end - Đỉnh cuối
 * @returns {number[]} - Mảng các đỉnh trên đường đi
 */
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

/* === Hàm xử lý sự kiện === */
/**
 * Gắn sự kiện cho các đỉnh, cạnh và canvas
 */
function attachNodeAndEdgeEvents() {
    // Lấy các phần tử modal
    const weightModal = document.getElementById('weightModal');
    const weightInput = document.getElementById('weightInput');
    const weightOk = document.getElementById('weightOk');
    const weightNoWeight = document.getElementById('weightNoWeight');
    const weightCancel = document.getElementById('weightCancel');
    const labelModal = document.getElementById('labelModal');
    const labelInput = document.getElementById('labelInput');
    const labelOk = document.getElementById('labelOk');
    const labelCancel = document.getElementById('labelCancel');

    /**
     * Hiển thị modal để nhập trọng số
     * @param {number} currentWeight - Trọng số hiện tại
     * @returns {Promise<number|null>} - Trọng số mới hoặc null nếu hủy
     */
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

    /**
     * Hiển thị modal để chỉnh sửa nhãn
     * @param {string} currentLabel - Nhãn hiện tại
     * @returns {Promise<string|null>} - Nhãn mới hoặc null nếu hủy
     */
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

    const svg = d3.select('#graph-canvas');

    // Sự kiện click trên canvas để thêm đỉnh
    svg.on('click', function (event) {
        let [x, y] = d3.pointer(event).map(Math.round);
        const mode = modeSelect.value;

        if (mode === 'add-node') {
            const id = graph.getVertices().length + 1;
            const label = generateVertexId(id - 1);
            graph.addVertex(id, label, x, y);
            visualizer.updateGraph(graph);
            updateNodeDropdowns();
            showMessage(`Đỉnh ${label} đã được thêm tại (${x.toFixed(0)}, ${y.toFixed(0)}).`);
        }
    });

    // Sự kiện click trên các đỉnh
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
                            showMessage(`Cạnh từ ${labelU} đến ${labelV} với trọng số ${weight === 0 ? 'không trọng số' : weight} đã được thêm.`);
                        }
                    }
                    selectedNodesForEdge = [];
                }
            } else if (mode === 'delete') {
                graph.removeVertex(d.id);
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
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
                    showMessage(`Nhãn của đỉnh ${d.label} đã được đổi thành ${newLabel}.`);
                }
            }
        });

    // Sự kiện click trên các cạnh
    visualizer.edges.selectAll('.edge')
        .on('click', async function (event, d) {
            event.stopPropagation();
            const mode = modeSelect.value;

            if (mode === 'delete') {
                graph.removeEdge(d.source, d.target);
                visualizer.updateGraph(graph);
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
                    showMessage(`Cạnh từ ${graph.getVertexLabel(d.source)} đến ${graph.getVertexLabel(d.target)} đã được cập nhật trọng số thành ${newWeight === 0 ? 'không trọng số' : newWeight}.`);
                }
            }
        });

    // Sự kiện drag để di chuyển canvas
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
        })
        .on('end', function () {
            if (modeSelect.value !== 'move') return;
            d3.select(this).style('cursor', 'default');
        }));
}

/* === Sự kiện giao diện === */
// Chọn chế độ thao tác
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

// Chọn thuật toán
algorithmSelect.addEventListener('change', (event) => {
    const algorithm = event.target.value;
    switch (algorithm) {
        case 'bfs':
            showMessage('Thuật toán BFS: Tìm kiếm theo chiều rộng.\nHãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.');
            break;
        case 'dijkstra':
            showMessage('Thuật toán Dijkstra: Tìm đường đi ngắn nhất.\nHãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.');
            break;
        case 'bellman-ford':
            showMessage('Thuật toán Bellman-Ford: Tìm đường đi ngắn nhất với trọng số âm.\nHãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.');
            break;
        case 'floyd-warshall':
            showMessage('Thuật toán Floyd-Warshall: Tìm đường đi ngắn nhất giữa tất cả các cặp đỉnh.\nHãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.');
            break;
        case 'a-star':
            showMessage('Thuật toán A*: Tìm đường đi ngắn nhất với heuristic.\nHãy chọn đỉnh đầu, đỉnh cuối và run để chạy thuật toán.');
            break;
        default:
            showMessage('Chọn một thuật toán để bắt đầu.');
            break;
    }
});

// Chạy thuật toán
runAlgorithmButton.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    const startNode = parseInt(startNodeSelect.value);
    const endNode = parseInt(endNodeSelect.value);

    if (algorithm === 'default') {
        showMessage('Vui lòng chọn thuật toán.');
        return;
    }
    if (isNaN(startNode) || isNaN(endNode)) {
        showMessage('Vui lòng chọn đỉnh đầu và đỉnh cuối hợp lệ.');
        return;
    }

    const edges = graph.getEdges();
    const vertices = graph.getVertices();

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
        const hasNegativeWeight = edges.some(edge => edge.w < 0);
        if (hasNegativeWeight) {
            showMessage('Thuật toán A* không hỗ trợ trọng số âm.');
            return;
        }
        const hasInvalidPosition = vertices.some(vertex => {
            const pos = graph.getVertexPosition(vertex);
            return pos === null || isNaN(pos.x) || isNaN(pos.y);
        });
        if (hasInvalidPosition) {
            showMessage('Đồ thị có đỉnh không có tọa độ hợp lệ, không thể chạy thuật toán A*.');
            return;
        }
    }

    let result = null;
    try {
        switch (algorithm) {
            case 'bfs':
                result = bfs(graph, startNode);
                lastAlgorithmResult = { algorithm, distances: result.distances, vertices };
                break;
            case 'dijkstra':
                result = dijkstra(graph, startNode);
                lastAlgorithmResult = { algorithm, distances: result.distances, vertices };
                break;
            case 'bellman-ford':
                result = bellmanFord(graph, startNode);
                lastAlgorithmResult = { algorithm, distances: result.distances, vertices };
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
                lastAlgorithmResult = { algorithm, distances: fwResult.distances, vertexIndex, vertices };
                break;
            case 'a-star':
                result = aStar(graph, startNode, endNode);
                lastAlgorithmResult = { algorithm, distances: result.distances, vertices };
                break;
        }

        const path = getPath(result.predecessors, startNode, endNode);
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

// Kiểm tra thành phần liên thông
checkComponentButton.addEventListener('click', () => {
    const { count, components } = dfs(graph);
    const message = `Số thành phần liên thông: ${count}\n` +
        components.map((comp, idx) =>
            `Thành phần ${idx + 1}: ${comp.map(vertex => graph.getVertexLabel(vertex)).join(', ')}`
        ).join('\n');

    showMessage(message);
    visualizer.clearHighlights();
});

// Tạo đồ thị ngẫu nhiên
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

// Xóa đồ thị
clearGraphButton.addEventListener('click', () => {
    graph.vertices = [];
    graph.edges = [];
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    attachNodeAndEdgeEvents();
    showMessage('Đồ thị đã được xóa.');
    visualizer.clearHighlights();
    lastAlgorithmResult = null;
});

// Xử lý các tùy chọn
optionsSelect.addEventListener('change', async (event) => {
    const option = event.target.value;
    let matrixText = '';

    switch (option) {
        case 'export':
            const saveSuccess = await saveGraphToFile(graph);
            showMessage(saveSuccess ? 'Đồ thị đã được xuất thành file JSON.' : 'Xuất file thất bại.');
            break;
        case 'import':
            const loadedGraphData = await loadGraphFromFile();
            if (loadedGraphData) {
                const loadedGraph = Graph.fromJSON(loadedGraphData);
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
            setTimeout(() => URL.revokeObjectURL(svgUrl), 100);
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
        case 'input-matrix':
            matrixText = await showMatrixInputModal();
            if (matrixText) {
                try {
                    graph.fromAdjacencyMatrix(matrixText, canvasWidth, canvasHeight);
                    visualizer.updateGraph(graph);
                    updateNodeDropdowns();
                    attachNodeAndEdgeEvents();
                    showMessage('Đồ thị đã được tạo từ ma trận trọng số.');
                } catch (error) {
                    showMessage(`Lỗi: ${error.message}`);
                }
            } else {
                showMessage('Hủy nhập ma trận.');
            }
            break;
        case 'view-result-matrix':
            if (!lastAlgorithmResult) {
                showMessage('Chưa chạy thuật toán nào. Vui lòng chạy thuật toán trước.');
                break;
            }
            const { algorithm, distances, vertices, vertexIndex } = lastAlgorithmResult;
            if (algorithm === 'floyd-warshall') {
                const labels = vertices.map(v => graph.getVertexLabel(v));
                matrixText += '   ' + labels.map(l => l.padEnd(4)).join('');
                matrixText += '\n';
                vertices.forEach((v, i) => {
                    const row = vertices.map(u => {
                        const dist = distances.get(vertexIndex.get(v), vertexIndex.get(u));
                        return dist === Infinity ? 'INF' : dist.toString();
                    });
                    matrixText += `${labels[i].padEnd(2)} ${row.map(val => val.padEnd(4)).join('')}\n`;
                });
            } else {
                matrixText = 'Đỉnh | Khoảng cách\n';
                matrixText += '-----|------------\n';
                vertices.forEach(v => {
                    const dist = distances[v];
                    const label = graph.getVertexLabel(v);
                    matrixText += `${label.padEnd(4)} | ${dist === Infinity ? 'INF' : dist}\n`;
                });
            }
            showResultMatrixModal(matrixText);
            break;
        case 'auto-layout':
            autoLayoutGraph();
            break;
    }

    event.target.value = "default";
});

// Quản lý đồ thị
document.getElementById('save-graph').addEventListener('click', async () => {
    const name = await showSaveGraphModal();
    if (name) {
        if (graph.getVertices().length === 0) {
            showMessage('Đồ thị rỗng, không thể lưu.');
            return;
        }
        const graphId = saveGraphToStorage(name, graph);
        currentGraphId = graphId;
        loadGraphList();
        showMessage(`Đồ thị "${name}" đã được lưu.`);
    } else {
        showMessage('Hủy lưu đồ thị.');
    }
});

document.getElementById('delete-graph').addEventListener('click', () => {
    const graphList = document.getElementById('graph-list');
    const graphId = graphList.value;
    if (graphId === 'default') {
        showMessage('Vui lòng chọn một đồ thị từ danh sách để xóa.');
        return;
    }
    const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
    const graphName = graphs[graphId]?.name || 'Không xác định';
    deleteGraphFromStorage(graphId);
    graphList.value = 'default';
    showMessage(`Đồ thị "${graphName}" đã được xóa.`);
});

document.getElementById('graph-list').addEventListener('change', (event) => {
    const graphId = event.target.value;
    if (graphId !== 'default') {
        loadGraphFromStorage(graphId);
        showMessage(`Đã chọn đồ thị. Nhấn "Xóa Đồ Thị" để xóa hoặc tiếp tục chỉnh sửa.`);
    }
});

/* === Khởi tạo ứng dụng === */
/**
 * Khởi tạo đồ thị mẫu và giao diện
 */
function init() {
    // Thêm các đỉnh mẫu
    graph.addVertex(1, 'A', 100, 100);
    graph.addVertex(2, 'B', 200, 200);
    graph.addVertex(3, 'C', 350, 250);
    graph.addVertex(4, 'D', 400, 100);
    graph.addVertex(5, 'E', 500, 200);
    graph.addVertex(6, 'F', 600, 300);
    graph.addVertex(7, 'H', 354, 376);
    graph.addVertex(8, 'G', 100, 300);

    // Thêm các cạnh mẫu
    graph.addEdge(1, 2, 5);
    graph.addEdge(2, 3, 9);
    graph.addEdge(3, 4, 3);
    graph.addEdge(4, 5, 7);
    graph.addEdge(3, 6, 1);
    graph.addEdge(3, 8, 4);
    graph.addEdge(7, 6, 2);

    // Cập nhật giao diện
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    attachNodeAndEdgeEvents();
    loadGraphList();
    showMessage('<p>Chọn các chức năng ở bảng bên trái để bắt đầu thao tác với đồ thị.</p>');
}

// Chạy hàm khởi tạo
init();