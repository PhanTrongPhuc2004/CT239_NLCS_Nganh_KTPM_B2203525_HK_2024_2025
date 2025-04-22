# Ứng dụng vẽ và xử lý đồ thị vô hướng áp dụng giải thuật tìm đường đi ngắn nhất

Ứng dụng này là một công cụ học tập trực quan, cho phép người dùng tương tác với đồ thị vô hướng, minh họa từng bước các thuật toán tìm đường đi ngắn nhất và kiểm tra miền liên thông. Dự án được phát triển bằng HTML, CSS, JavaScript, sử dụng D3.js để trực quan hóa đồ thị và Electron cùng Electron Forge để đóng gói thành ứng dụng desktop.

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các cấu trúc dữ liệu](#các-cấu-trúc-dữ-liệu)
- [Giải thuật được triển khai](#giải-thuật-được-triển-khai)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [License](#license)
- [Liên hệ và đóng góp](#liên-hệ-và-đóng-góp)

---

## Giới thiệu

Ứng dụng cung cấp một giao diện đồ họa trực quan để:

- Tạo, chỉnh sửa, và trực quan hóa đồ thị vô hướng.
- Thêm, xóa, di chuyển đỉnh/cạnh, và nhập trọng số (bao gồm số âm).
- Kiểm tra và hiển thị các miền liên thông của đồ thị bằng thuật toán DFS.
- Thực hiện và minh họa các thuật toán tìm đường đi ngắn nhất: BFS, Dijkstra, Bellman-Ford, Floyd-Warshall, và A*.
- Lưu trữ đồ thị dưới dạng file JSON hoặc trong localStorage, nhập/xuất đồ thị, và xuất đồ thị dưới dạng ảnh SVG.
- Tạo đồ thị ngẫu nhiên và tự động sắp xếp bố cục đồ thị.

---

## Tính năng

- **Giao diện nhập đồ thị trực quan:**

  - Thêm đỉnh bằng cách nhấp chuột trái vào canvas.
  - Thêm cạnh bằng cách chọn hai đỉnh (hỗ trợ nhập trọng số, bao gồm số âm).
  - Di chuyển đỉnh bằng cách kéo thả, chỉnh sửa nhãn đỉnh hoặc trọng số cạnh.
  - Xóa đỉnh/cạnh bằng cách nhấp chuột trong chế độ xóa.

- **Kiểm tra miền liên thông:**

  - Sử dụng thuật toán DFS để xác định số miền liên thông và liệt kê các đỉnh thuộc mỗi miền.

- **Triển khai các giải thuật tìm đường đi ngắn nhất:**

  - **BFS:** Tìm đường đi ngắn nhất trong đồ thị không trọng số (dựa trên số cạnh).
  - **DFS:** Kiểm tra tính liên thông, xác định số miền liên thông của đồ thị.
  - **Dijkstra:** Tìm đường đi ngắn nhất cho đồ thị có trọng số không âm, sử dụng hàng đợi ưu tiên.
  - **Bellman-Ford:** Xử lý trọng số âm và phát hiện chu trình âm.
  - **Floyd-Warshall:** Tìm đường đi ngắn nhất giữa mọi cặp đỉnh.
  - **A\*:** Tìm đường đi ngắn nhất giữa hai đỉnh, kết hợp chi phí thực tế và hàm heuristic (Euclidean).

- **Lưu trữ và quản lý đồ thị:**
  - Lưu đồ thị vào localStorage hoặc xuất ra file JSON.
  - Nhập đồ thị từ file JSON hoặc localStorage.
  - Xuất đồ thị dưới dạng ảnh SVG.
  - Xóa đồ thị đã lưu hoặc tạo đồ thị mới.

- **Lưu trữ và quản lý đồ thị:**
  - Tạo đồ thị ngẫu nhiên với số đỉnh và cạnh ngẫu nhiên.
  - Nhập đồ thị từ ma trận trọng số.
  - Xem ma trận khoảng cách hoặc thông tin đồ thị (đỉnh, cạnh).
  - Tự động sắp xếp bố cục đồ thị theo lưới.

- **Minh họa quá trình thuật toán:**
  - Hiển thị từng bước thực hiện thuật toán (khoảng cách, đường đi, đỉnh đã thăm).
  - Làm nổi bật đường đi ngắn nhất trên canvas.

---

## Cấu trúc dự án

```
├── main.js                  // File main process của Electron: tạo cửa sổ và tải giao diện HTML chính.
├── package.json             // File cấu hình dự án: dependencies, scripts, metadata.
├── package-lock.json        // Khóa phiên bản của dependencies.
├── forge.config.js          // Cấu hình của Electron Forge.
├── src/                     // Chứa toàn bộ code của renderer process.
│   ├── index.html           // Giao diện HTML chính chứa canvas D3.js và các thành phần giao diện khác.
│   ├── styles.css           // File CSS cho giao diện.
│   ├── renderer.js          // Entry point của renderer process: quản lý UI và kết nối các module.
│   ├── graph/               // Chứa các lớp và module quản lý mô hình đồ thị.
│   │   ├── vertex.js        // Lớp Vertex (đỉnh): chứa các thuộc tính id, label, tọa độ (x, y).
│   │   ├── edge.js          // Lớp Edge (cạnh): chứa thông tin của cạnh (đỉnh nguồn, đỉnh đích, trọng số).
│   │   └── graph.js         // Lớp Graph: quản lý danh sách đỉnh và cạnh.
│   ├── algorithms/          // Triển khai các giải thuật.
│   │   ├── bfs.js           // Thuật toán BFS.
│   │   ├── dfs.js           // Thuật toán DFS: kiểm tra miền liên thông.
│   │   ├── dijkstra.js      // Thuật toán Dijkstra.
│   │   ├── bellmanFord.js   // Thuật toán Bellman-Ford.
│   │   ├── floydWarshall.js // Thuật toán Floyd-Warshall.
│   │   └── aStar.js         // Thuật toán A* (sử dụng heuristic Euclidean).
│   ├── dataStructures/      // Các cấu trúc dữ liệu hỗ trợ thuật toán.
│   │   ├── stack.js         // Ngăn xếp (Stack) cho DFS.
│   │   ├── queue.js         // Hàng đợi (Queue) cho BFS.
│   │   └── priorityQueue.js // Hàng đợi ưu tiên cho Dijkstra và A*.
│   │   └── matrix.js        // Ma trận cho Floyd-Warshall.
│   ├── utils/               // Các hàm tiện ích.
│   │   ├── fileUtils.js     // Lưu mở file JSON.
│   ├── visualization/       // Mã D3.js để vẽ đồ thị.
│   │   └── graphVisualizer.js // Quản lý việc vẽ, cập nhật đồ thị và hiển thị bước thuật toán.
|   ├── assets/              // Tài nguyên như hình ảnh, biểu tượng…
├── .gitignore               // Cấu hình Git.
└── README.md                // (File này) Tài liệu hướng dẫn và giới thiệu dự án.
```

---

## Các cấu trúc dữ liệu

- **Danh sách đỉnh:** Mỗi đỉnh chứa thông tin:

  - `id`: Mã định danh (số nguyên).
  - `label`: Nhãn hiển thị (mặc định là chữ cái: A, B, ..., AA, AB, ...).
  - `x`, `y`: Tọa độ hiển thị trên canvas (sử dụng bởi D3.js).

- **Danh sách cạnh:** Mỗi cạnh được lưu dưới dạng bộ ba `(u, v, w)`:

  - `u`: Đỉnh nguồn.
  - `v`: Đỉnh đích.
  - `w`: Trọng số của cạnh (có thể âm).

- **Cấu trúc hỗ trợ thuật toán:**

  - **Stack:** Dùng cho DFS (LIFO).
  - **Queue:** Dùng cho BFS (FIFO).
  - **Priority Queue:** Dùng cho thuật toán Dijkstra và A\*.
  - **Matrix:** Ma trận khoảng cách cho thuật toán Floyd-Warshall.
  - **Mảng:** Để lưu trạng thái của các đỉnh (đã thăm, khoảng cách, đỉnh trước).

- **Lưu trữ file:** 
  - **localStorage:** Lưu danh sách đồ thị với tên và dữ liệu JSON.
  - **File JSON:** Lưu thông tin đỉnh, cạnh, và trọng số.

---

## Giải thuật được triển khai

### 1. Thuật toán BFS

- **Mục đích:** Tìm đường đi ngắn nhất trong đồ thị không trọng số (số cạnh tối thiểu).
- **Quá trình:**
  1. Khởi tạo hàng đợi và thêm đỉnh nguồn.
  2. Đánh dấu đỉnh nguồn là đã thăm, đặt khoảng cách bằng 0.
  3. Lặp: lấy đỉnh từ đầu hàng đợi, duyệt các đỉnh kề chưa thăm, cập nhật khoảng cách và thêm vào hàng đợi.
  4. Trả về mảng khoảng cách và đường đi.

### 2. Thuật toán DFS

- **Mục đích:** Kiểm tra tính liên thông và đếm số miền liên thông của đồ thị.
- **Quá trình:**
  1. Sử dụng ngăn xếp để duyệt các đỉnh.
  2. Với mỗi đỉnh chưa thăm, bắt đầu duyệt và đánh dấu các đỉnh kề.
  3. Mỗi lần duyệt xong một miền, tăng biến đếm miền liên thông.
  4. Trả về số miền liên thông và danh sách các đỉnh theo miền.

### 3. Thuật toán Dijkstra

- **Mục đích:** Tìm đường đi ngắn nhất trong đồ thị có trọng số không âm.
- **Quá trình:**
  1. Khởi tạo khoảng cách của đỉnh nguồn bằng 0 và các đỉnh khác bằng ∞.
  2. Sử dụng hàng đợi ưu tiên để chọn đỉnh có khoảng cách nhỏ nhất.
  3. Cập nhật khoảng cách cho các đỉnh kề nếu tìm được đường đi ngắn hơn.

### 4. Thuật toán Bellman-Ford

- **Mục đích:** Tìm đường đi ngắn nhất trong đồ thị có thể có trọng số âm và phát hiện chu trình âm.
- **Quá trình:**
  1. Khởi tạo khoảng cách như Dijkstra.
  2. Lặp |V| - 1 lần: cập nhật khoảng cách cho từng cạnh.
  3. Kiểm tra chu trình âm sau khi cập nhật.

### 5. Thuật toán Floyd-Warshall

- **Mục đích:** Tìm đường đi ngắn nhất giữa mọi cặp đỉnh.
- **Quá trình:**
  1. Tạo ma trận khoảng cách và ma trận "trước".
  2. Cập nhật giá trị khoảng cách qua từng đỉnh trung gian.
  3. Nếu phát hiện chu trình âm (D[i][i] < 0) thì báo lỗi.

### 6. Thuật toán A\*

- **Mục đích:** Tìm đường đi ngắn nhất từ đỉnh nguồn đến đỉnh đích cho đồ thị có trọng số không âm bằng việc sử dụng hàm heuristic.
- **Quá trình:**
  1. Khởi tạo chi phí g(s) = 0 và f(s) = h(s).
  2. Sử dụng hàng đợi ưu tiên để duy trì sự kết hợp của chi phí thực tế và ước tính.
  3. Cập nhật giá trị g và f cho các đỉnh kề, cho đến khi đến đích.

---

## Hướng dẫn cài đặt

1. **Yêu cầu:**

   - [Node.js](https://nodejs.org/) (phiên bản mới nhất khuyến nghị).
   - [Git](https://git-scm.com/) để clone dự án.

2. **Clone dự án:**

   ```bash
   git clone https://github.com/PhanTrongPhuc2004/CT239_NLCS_Nganh_KTPM_B2203525_HK_2024_2025.git
   cd CT239_NLCS_Nganh_KTPM_B2203525_HK_2024_2025
   ```

3. **Cài đặt các các thư viện phụ thuộc:**

   ```bash
   npm install
   ```

4. **Chạy ứng dụng web:**
   Dự án sử dụng Electron và Electron Forge, vì vậy chạy:

   ```bash
   npm start
   ```

   Lệnh này sẽ khởi chạy Electron, mở cửa sổ chính và tải giao diện đồ họa.

5. **Kết xuất ứng dụng desktop:**
   Dự án sử dụng Electron và Electron Forge, vì vậy chạy:
   ```bash
   npm run make
   ```
   Lệnh này sẽ khởi chạy Electron để kết xuất ra ứng dụng desktop.

---

## Hướng dẫn sử dụng

- **Nhập đồ thị:**

  - Chọn chế độ “Thêm đỉnh” và nhấp chuột trái vào canvas để thêm đỉnh.
  - Chọn chế độ “Thêm cạnh”, nhấp vào hai đỉnh để tạo cạnh, nhập trọng số qua modal.
  - Nhập đồ thị từ ma trận trọng số qua tùy chọn “Nhập liệu đồ thị”.

- **Chỉnh sửa đồ thị:**

  - Chọn chế độ “Di chuyển” để kéo thả đỉnh hoặc toàn bộ đồ thị.
  - Chọn chế độ “Chỉnh sửa đỉnh/cạnh” để thay đổi nhãn đỉnh hoặc trọng số cạnh.
  - Chọn chế độ “Xóa” để xóa đỉnh/cạnh bằng cách nhấp vào chúng.
- **Kiểm tra miền liên thông:**

  - Nhấn nút “Bộ phận liên thông” để xem số miền liên thông và danh sách đỉnh.

- **Chạy thuật toán tìm đường đi ngắn nhất:**

  - Chọn thuật toán từ dropdown (BFS, Dijkstra, v.v.).
  - Chọn đỉnh đầu và đỉnh cuối từ dropdown.
  - Nhấn “Chạy thuật toán” để xem kết quả (đường đi, chi phí) và đường đi được highlight trên canvas.

- **Quản lý đồ thị:**
  - Nhấn “Lưu đồ thị” để lưu vào localStorage với tên tùy chỉnh.
  - Nhấn “Xóa đồ thị đã lưu” để xóa đồ thị từ localStorage.
  - Sử dụng tùy chọn “Xuất file” để lưu đồ thị thành JSON hoặc “Nhập file” để tải JSON.
  - Xuất đồ thị thành ảnh SVG qua tùy chọn “Xuất ảnh”.

- **Tính năng bổ sung:**
  - Nhấn “Đồ thị ngẫu nhiên” để tạo đồ thị với số đỉnh/cạnh ngẫu nhiên.
  - Chọn “Sắp xếp lại đồ thị” để tự động bố trí đỉnh theo lưới.
  - Xem thông tin đồ thị (đỉnh, cạnh) hoặc ma trận khoảng cách qua các tùy chọn tương ứng.

---

## Yêu cầu hệ thống

- Hệ điều hành: Windows.
- Node.js phiên bản 12 trở lên.
- Dùng Electron (phiên bản Electron Forge được cấu hình sẵn trong `forge.config.js`).

---

## License

Dự án này được cấp phép thực hiện theo [Học phần CT239_NLCS ngành KTPM HK2 2024-2025 ].

---

## Liên hệ và đóng góp

Nếu bạn có góp ý, phát hiện lỗi hay muốn đóng góp thêm tính năng, vui lòng:

- Mở issue trên GitHub.
- Gửi pull request với chi tiết thay đổi.
- Liên hệ qua email: **[phucb2203525@student.ctu.edu.vn](mailto:phucb2203525@student.ctu.edu.vn)**

---
