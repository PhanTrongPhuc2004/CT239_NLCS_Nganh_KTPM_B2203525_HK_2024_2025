// import các cấu trúc dữ liệu và thuật toán cần thiết đã được định nghĩa trong các file khác
// và sử dụng chúng trong renderer.js để tạo giao diện người dùng cho ứng dụng Electron.
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

// Lấy kích thước thực tế của phần tử #graph-canvas
const canvasContainer = document.querySelector('.canvas-container');
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;

// Khởi tạo đồ thị và visualizer với kích thước động
const graph = new Graph();
const visualizer = new GraphVisualizer('#graph-canvas', canvasWidth, canvasHeight);

// Các phần tử giao diện trong HTML
const modeSelect = document.getElementById('mode-select');
const algorithmSelect = document.getElementById('algorithm-select');
const startNodeSelect = document.getElementById('start-node-select');
const endNodeSelect = document.getElementById('end-node-select');
const runAlgorithmButton = document.getElementById('run-algorithm');
const checkComponentButton = document.getElementById('check-component');
const randomGraphButton = document.getElementById('random-graph');
const clearGraphButton = document.getElementById('clear-graph');
const optionsSelect = document.querySelectorAll('#mode-select')[1]; // Lấy select thứ hai (Tùy Chọn)
const messageContent = document.getElementById('contentMessage');
const startToEndNodes = document.getElementById('startToEndNodes');
const cost = document.getElementById('cost');
const path = document.getElementById('path');

// Trạng thái tạm để thêm cạnh
let selectedNodesForEdge = [];

// Hàm cập nhật danh sách đỉnh trong dropdown
function updateNodeDropdowns() {
    // Xóa tất cả tùy chọn hiện tại trong dropdown Đỉnh Đầu và Đỉnh Cuối
    startNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh đầu</option>';
    endNodeSelect.innerHTML = '<option value="default" selected hidden>Chọn đỉnh cuối</option>';

    // Lấy danh sách tất cả đỉnh hiện tại từ đồ thị
    const vertices = graph.getVertices();
    // Thêm từng đỉnh vào dropdown Đỉnh Đầu và Đỉnh Cuối
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

// Hàm hiển thị thông báo gợi ý
function showMessage(message) {
    // Thay \n bằng <br> để xuống dòng trong HTML
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageContent.innerHTML = formattedMessage;
}

/// Hàm hiển thị kết quả thuật toán
function displayResult(graph, startNode, endNode, pathArray, totalCost) {
    const startLabel = graph.getVertexLabel(startNode);
    const endLabel = graph.getVertexLabel(endNode);

    // Kiểm tra pathArray có phải là mảng không
    if (!Array.isArray(pathArray) || pathArray.length === 0) {
        startToEndNodes.textContent = `Không có đường đi từ ${startLabel} đến ${endLabel}.`;
        cost.textContent = 'Chi phí: N/A';
        path.textContent = 'Đường đi: N/A';
        return;
    }

    // Chuyển các đỉnh trong pathArray thành label
    const pathLabels = pathArray.map(vertex => graph.getVertexLabel(vertex));

    startToEndNodes.textContent = `Đường đi ngắn nhất từ đỉnh ${startLabel} đến đỉnh ${endLabel}:`;
    cost.textContent = `Chi phí: ${totalCost}`;
    path.textContent = `Đường đi: ${pathLabels.join(' -> ')}`;
}

// Hàm lấy đường đi từ predecessors
function getPath(predecessors, start, end) {
    const path = [];
    let current = end;
    while (current !== null) {
        path.push(current);
        current = predecessors[current];
    }
    if (path[path.length - 1] !== start) return []; // Không có đường đi
    return path.reverse();
}

// Xử lý sự kiện thay đổi chế độ
modeSelect.addEventListener('change', (event) => {
    const mode = event.target.value;
    selectedNodesForEdge = []; // Reset trạng thái chọn đỉnh khi thay đổi chế độ
    switch (mode) {
        case 'add-node':
            showMessage('Click vào vùng canvas bên dưới đây để thêm đỉnh.');
            break;
        case 'add-edge':
            showMessage('Click vào hai đỉnh để tạo cạnh.');
            break;
        case 'delete':
            showMessage('Click vào đỉnh hoặc cạnh để xóa.');
            break;
        case 'move':
            showMessage('Kéo đỉnh để di chuyển.');
            enableNodeDragging();
            break;
        default:
            showMessage('Chọn một chế độ thao tác để bắt đầu.');
            break;
    }
});

// Hàm hiển thị thông báo gợi ý các thuật toán
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

// Hàm sinh ID cho đỉnh: A-Z, rồi AA, AB, ..., ZZ
function generateVertexId(index) {
    if (index < 26) {
        // Từ 0 đến 25: A đến Z
        return String.fromCharCode(65 + index);
    } else {
        // Từ 26 trở lên: AA, AB, ..., ZZ
        const firstCharIndex = Math.floor((index - 26) / 26);
        const secondCharIndex = (index - 26) % 26;
        return String.fromCharCode(65 + firstCharIndex) + String.fromCharCode(65 + secondCharIndex);
    }
}

// Xử lý sự kiện click trên canvas
window.addEventListener('DOMContentLoaded', () => {
    const svg = d3.select('#graph-canvas');
    // const { nodeData, edgeData } = visualizer.updateGraph(graph);

    // console.log(nodeData, edgeData); // Kiểm tra dữ liệu đỉnh và cạnh

    // Lấy các phần tử của modal
    const weightModal = document.getElementById('weightModal');
    const weightInput = document.getElementById('weightInput');
    const weightOk = document.getElementById('weightOk');
    const weightCancel = document.getElementById('weightCancel');

    // Hàm hiển thị modal và trả về Promise
    const showWeightModal = () => {
        return new Promise((resolve) => {
            weightModal.style.display = 'block'; // Hiển thị modal
            weightInput.value = '1'; // Giá trị mặc định

            weightOk.onclick = () => {
                const weight = parseFloat(weightInput.value);
                weightModal.style.display = 'none'; // Ẩn modal
                resolve(weight); // Trả về trọng số
            };

            weightCancel.onclick = () => {
                weightModal.style.display = 'none'; // Ẩn modal
                resolve(null); // Trả về null nếu hủy
            };
        });
    };

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

    // Xử lý click trên đỉnh
    visualizer.nodes.selectAll('.node')
        .on('click', async function (event, d) { // Thêm async để dùng await
            event.stopPropagation(); // Ngăn sự kiện click trên canvas
            const mode = modeSelect.value;

            if (mode === 'add-edge') {
                selectedNodesForEdge.push(d.id);
                showMessage(`Đã chọn đỉnh ${d.id}. ${selectedNodesForEdge.length === 1 ? 'Chọn đỉnh thứ hai để tạo cạnh.' : ''}`);

                if (selectedNodesForEdge.length === 2) {
                    const [u, v] = selectedNodesForEdge;
                    if (u === v) {
                        showMessage('Không thể tạo cạnh giữa một đỉnh với chính nó.');
                    } else if (graph.hasEdge(u, v)) {
                        showMessage('Cạnh đã tồn tại giữa hai đỉnh này.');
                    } else {
                        // Hiển thị modal để nhập trọng số
                        const weight = await showWeightModal();
                        if (weight === null) { // Người dùng nhấn Cancel
                            showMessage('Hủy thêm cạnh.');
                        } else if (isNaN(weight)) {
                            showMessage('Trọng số không hợp lệ, không tạo cạnh.');
                        } else {
                            graph.addEdge(u, v, weight);
                            let labelU = graph.getVertexLabel(u)
                            let labelV = graph.getVertexLabel(v)
                            visualizer.updateGraph(graph);
                            showMessage(`Cạnh từ ${labelU} đến ${labelV} với trọng số ${weight} đã được thêm.`);
                        }
                    }
                    selectedNodesForEdge = []; // Reset sau khi thêm cạnh
                }
            } else if (mode === 'delete') {
                graph.removeVertex(d.id);
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
                showMessage(`Đỉnh ${d.id} đã được xóa.`);
            }
        });

    // Xử lý click trên cạnh
    visualizer.edges.selectAll('.edge')
        .on('click', function (event, d) {
            event.stopPropagation();
            const mode = modeSelect.value;

            if (mode === 'delete') {
                graph.removeEdge(d.source, d.target);
                visualizer.updateGraph(graph);
                showMessage(`Cạnh từ ${d.source} đến ${d.target} đã được xóa.`);
            }
        });
});

// Xử lý sự kiện kéo thả đỉnh (di chuyển)
function enableNodeDragging() {
    visualizer.nodes.selectAll('.node')
        .call(
            d3.drag()
                .on('drag', (event, d) => {
                    // Giới hạn vị trí trong canvas
                    d.x = Math.max(20, Math.min(canvasWidth - 20, event.x));
                    d.y = Math.max(20, Math.min(canvasHeight - 20, event.y));
                    graph.setVertexPosition(d.id, d.x, d.y);
                    visualizer.updateGraph(graph);
                })
        );
}

//  1Xử lý sự kiện chạy thuật toán
runAlgorithmButton.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    const startNode = startNodeSelect.value;
    const endNode = endNodeSelect.value;

    if (algorithm === 'default') {
        showMessage('Vui lòng chọn thuật toán.');
        return;
    }
    if (startNode === 'default' || endNode === 'default') {
        showMessage('Vui lòng chọn đỉnh đầu và đỉnh cuối hợp lệ.');
        return;
    }

    let result = null;
    try {
        // Trong renderer.js, sau khi gọi thuật toán
        switch (algorithm) {
            case 'bfs':
                result = bfs(graph, startNode);
                console.log('BFS Result:', result); // Debug
                break;
            case 'dijkstra':
                result = dijkstra(graph, startNode);
                console.log('Dijkstra Result:', result); // Debug
                break;
            case 'bellman-ford':
                result = bellmanFord(graph, startNode);
                console.log('Bellman-Ford Result:', result); // Debug
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
                console.log('Floyd-Warshall Result:', result); // Debug
                break;
            case 'a-star':
                result = aStar(graph, startNode, endNode);
                console.log('A* Result:', result); // Debug
                break;
        }

        const path = getPath(result.predecessors, startNode, endNode);
        console.log('Path:', path); // Debug
        const totalCost = result.distances[endNode] === Infinity ? 'N/A' : result.distances[endNode];
        displayResult(graph, startNode, endNode, path, totalCost); // Truyền graph vào
        if (path.length > 0) {
            visualizer.highlightPath(path);
        } else {
            visualizer.clearHighlights();
        }
    } catch (error) {
        console.error('Error running algorithm:', error);
        showMessage(error.message);
        visualizer.clearHighlights();
    }
});

// Xử lý sự kiện kiểm tra thành phần liên thông
checkComponentButton.addEventListener('click', () => {
    const { count, components } = dfs(graph);
    console.log(graph.getNeighbors(3));

    const message = `Số thành phần liên thông: ${count}\n` +
        components.map((comp, idx) =>
            `Thành phần ${idx + 1}: ${comp.map(vertex => graph.getVertexLabel(vertex)).join(', ')}`
        ).join('\n');

    showMessage(message);
    visualizer.clearHighlights();
});

// Xử lý sự kiện tạo đồ thị mẫu
randomGraphButton.addEventListener('click', () => {
    // Xóa dữ liệu cũ
    graph.vertices = [];
    graph.edges = [];

    // Tạo số đỉnh ngẫu nhiên từ 4 đến 10
    const numVertices = Math.floor(Math.random() * 7) + 4; // 4 đến 10
    const vertexIds = [];

    // Tạo các đỉnh với ID và vị trí ngẫu nhiên
    for (let i = 0; i < numVertices; i++) {
        const id = generateVertexId(i);
        vertexIds.push(id);
        // Vị trí ngẫu nhiên trong canvas, trừ lề 50px
        const x = Math.random() * (canvasWidth - 100) + 50;
        const y = Math.random() * (canvasHeight - 100) + 50;

        graph.addVertex(id, id, Math.round(x), Math.round(y));
    }

    // Tạo số cạnh ngẫu nhiên: từ 1 đến n*(n-1)/2 (đồ thị vô hướng)
    const maxEdges = (numVertices * (numVertices - 1)) / 2;
    const numEdges = Math.floor(Math.random() * (maxEdges - 1)) + 1; // Từ 1 đến maxEdges

    // Tạo các cạnh ngẫu nhiên
    const addedEdges = new Set(); // Để tránh cạnh trùng
    for (let i = 0; i < numEdges; i++) {
        let u, v;
        let edgeKey;
        do {
            u = vertexIds[Math.floor(Math.random() * numVertices)];
            v = vertexIds[Math.floor(Math.random() * numVertices)];
            edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`; // Chuẩn hóa để tránh trùng
        } while (u === v || addedEdges.has(edgeKey)); // Tránh tự nối và cạnh trùng

        addedEdges.add(edgeKey);
        const weight = Math.floor(Math.random() * 10) + 1; // Trọng số từ 1 đến 10
        graph.addEdge(u, v, weight);
    }

    // Cập nhật giao diện
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    showMessage(`Đồ thị ngẫu nhiên đã được tạo: ${numVertices} đỉnh, ${numEdges} cạnh.`);
});

// Xử lý sự kiện xóa đồ thị
clearGraphButton.addEventListener('click', () => {
    graph.vertices = [];
    graph.edges = [];
    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    showMessage('Đồ thị đã được xóa.');
    visualizer.clearHighlights();
});

// Xử lý sự kiện tùy chọn (xuất file, nhập file, xuất ảnh, xem cấu trúc dữ liệu)
optionsSelect.addEventListener('change', async (event) => {
    const option = event.target.value;

    switch (option) {
        case 'export': // Xuất file
            const saveSuccess = await saveGraphToFile(graph);
            showMessage(saveSuccess ? 'Đồ thị đã được xuất thành file JSON.' : 'Xuất file thất bại.');
            break;
        case 'import': // Nhập file
            const loadedGraph = await loadGraphFromFile();
            if (loadedGraph) {
                graph.vertices = loadedGraph.vertices;
                graph.edges = loadedGraph.edges;
                visualizer.updateGraph(graph);
                updateNodeDropdowns();
                showMessage('Đồ thị đã được nhập từ file JSON.');
            } else {
                showMessage('Nhập file thất bại hoặc bị hủy.');
            }
            break;
        case 'image': // Xuất ảnh
            const svg = document.querySelector('#graph-canvas');
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = 'graph.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                showMessage('Đồ thị đã được xuất thành hình ảnh.');
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            break;
        case 'dataStructure': // Xem thông tin đồ thị
            const graphData = graph.toJSON();
            // Kiểm tra dữ liệu hợp lệ
            if (!graphData || !Array.isArray(graphData.vertices) || !Array.isArray(graphData.edges)) {
                showMessage('Lỗi: Dữ liệu đồ thị không hợp lệ.');
                break;
            }
            const message = `Cấu trúc dữ liệu:\n` +
                `Đỉnh: ${graphData.vertices.map(v => `ID: ${v.id}, Label: ${v.label}, (x: ${v.x}, y: ${v.y})`).join('\n')}\n` +
                `Cạnh: ${graphData.edges.map(e => `(${e.u} -> ${e.v}, w: ${e.w})`).join('\n')}`;
            showMessage(message);
            break;
    }

    event.target.value = "default";
});

// Xử lý sự kiện thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;
    visualizer.width = newWidth;
    visualizer.height = newHeight;
    visualizer.svg.attr('viewBox', `0 0 ${newWidth} ${newHeight}`);
    visualizer.updateGraph(graph);
});

// Khởi tạo ứng dụng
function init() {
    graph.addVertex('1', 'A', 100, 100);
    graph.addVertex('2', 'B', 200, 200);
    graph.addVertex('3', 'C', 350, 250);
    graph.addVertex('4', 'D', 400, 100);
    graph.addVertex('5', 'E', 500, 200);
    graph.addVertex('6', 'F', 600, 300);
    graph.addVertex('7', 'H', 354, 376);
    graph.addVertex('8', 'G', 100, 300);

    graph.addEdge('1', '2', 5);
    graph.addEdge('2', '3', 9);
    graph.addEdge('3', '4', 3);
    graph.addEdge('4', '5', 7);
    graph.addEdge('3', '6', 1);
    graph.addEdge('3', '8', 4);
    graph.addEdge('7', '6', 2);

    visualizer.updateGraph(graph);
    updateNodeDropdowns();
    showMessage('<p>Chọn các chức năng ở bảng bên trái để bắt đầu thao tác với đồ thị.</p>');
}

// Gọi hàm khởi tạo
init();