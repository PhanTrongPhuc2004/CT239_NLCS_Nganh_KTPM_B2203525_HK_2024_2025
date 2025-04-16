# Ứng dụng vẽ và xử lý đồ thị vô hướng áp dụng giải thuật tìm đường đi ngắn nhất

Ứng dụng này được xây dựng với mục tiêu tạo ra một công cụ học tập trực quan, cho phép người dùng tương tác với đồ thị vô hướng và kiểm tra, minh họa từng bước của các thuật toán tìm đường đi ngắn nhất cũng như kiểm tra miền liên thông.  
Dự án được phát triển bằng công nghệ HTML, CSS, JavaScript, sử dụng D3.js cho việc trực quan hóa và Electron cùng Electron Forge để đóng gói ứng dụng.

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

Ứng dụng cho phép:

- Nhập và chỉnh sửa đồ thị vô hướng thông qua giao diện đồ họa trực quan.
- Tạo, di chuyển, chỉnh sửa và xóa các đỉnh và cạnh của đồ thị.
- Nhập trọng số cho các cạnh, bao gồm cả các giá trị âm.
- Kiểm tra miền liên thông của đồ thị sử dụng thuật toán DFS hoặc BFS.
- Thực hiện và minh họa chi tiết quá trình của các thuật toán tìm đường đi ngắn nhất như BFS, Dijkstra, Bellman-Ford, Floyd-Warshall và A\* (sử dụng hàm heuristic Euclidean dựa trên tọa độ D3.js).
- Lưu và mở lại đồ thị dưới dạng file JSON để dễ dàng tái sử dụng.

---

## Tính năng

- **Giao diện nhập đồ thị trực quan:**

  - Thêm đỉnh bằng cách nhấp chuột trái vào vùng canvas.
  - Thêm cạnh bằng cách kéo chuột từ đỉnh này đến đỉnh khác.
  - Cho phép nhập trọng số cạnh (bao gồm cả số âm).
  - Di chuyển, chỉnh sửa vị trí đỉnh (kéo thả) và xóa các đỉnh, cạnh qua menu ngữ cảnh hoặc thanh công cụ.

- **Kiểm tra miền liên thông:**

  - Xác định và liệt kê số miền liên thông cùng danh sách các đỉnh thuộc mỗi miền.
  - Tô màu các miền khác nhau để phân biệt.

- **Triển khai các giải thuật tìm đường đi ngắn nhất:**

  - **BFS:** Tìm đường đi ngắn nhất trong đồ thị không trọng số (dựa trên số cạnh).
  - **DFS:** Kiểm tra tính liên thông, xác định số miền liên thông của đồ thị.
  - **Dijkstra:** Tìm đường đi ngắn nhất cho đồ thị có trọng số không âm, sử dụng hàng đợi ưu tiên.
  - **Bellman-Ford:** Xử lý trọng số âm và phát hiện chu trình âm.
  - **Floyd-Warshall:** Tìm đường đi ngắn nhất giữa mọi cặp đỉnh.
  - **A\*:** Tìm đường đi ngắn nhất giữa hai đỉnh, kết hợp chi phí thực tế và hàm heuristic (Euclidean).

- **Lưu trữ và quản lý đồ thị:**

  - Xuất đồ thị ra file JSON.
  - Nạp (mở) đồ thị từ file đã lưu.
  - Tạo đồ thị mới từ đầu.

- **Minh họa quá trình thuật toán:**
  - Hiển thị từng bước xử lý của thuật toán (thứ tự thăm, cập nhật khoảng cách, đỉnh đã thăm) và làm nổi bật đường đi ngắn nhất trên giao diện.

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
│   │   └── otherUtils.js    // Các hàm tiện ích khác.
│   └── visualization/       // Mã D3.js để vẽ đồ thị.
│       └── graphVisualizer.js // Quản lý việc vẽ, cập nhật đồ thị và hiển thị bước thuật toán.
├── assets/                  // Tài nguyên như hình ảnh, biểu tượng…
├── .gitignore               // Cấu hình Git.
└── README.md                // (File này) Tài liệu hướng dẫn và giới thiệu dự án.
```

---

## Các cấu trúc dữ liệu

- **Danh sách đỉnh:** Mỗi đỉnh chứa thông tin:

  - `id`: Số thứ tự hoặc mã định danh của đỉnh.
  - `label`: Nhãn hiển thị cho đỉnh.
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

- **Lưu trữ file:** Đồ thị được lưu dưới dạng file JSON bao gồm thông tin về đỉnh, cạnh và trọng số.

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

3. **Cài đặt dependencies:**

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
   npm make
   ```
   Lệnh này sẽ khởi chạy Electron để kết xuất ra ứng dụng desktop.

---

## Hướng dẫn sử dụng

- **Nhập đồ thị:**

  - Nhấp chuột trái vào vùng canvas để tạo một đỉnh mới.
  - Nhấp và kéo chuột từ một đỉnh đến đỉnh khác để tạo cạnh.
  - Sau khi tạo cạnh, một hộp thoại hiện ra cho phép nhập trọng số (hỗ trợ số âm).

- **Chỉnh sửa:**

  - Kéo thả các đỉnh để di chuyển.
  - Nhấp đúp vào đỉnh để chỉnh sửa nhãn.
  - Nhấp chuột phải vào đỉnh hoặc cạnh để xóa (hoặc sử dụng nút xóa trên thanh công cụ).

- **Kiểm tra miền liên thông:**

  - Nhấn nút “Kiểm tra miền liên thông” trên thanh công cụ.
  - Kết quả sẽ hiển thị số miền liên thông và danh sách các đỉnh thuộc mỗi miền, kèm theo tô màu khác nhau cho từng miền.

- **Chạy thuật toán tìm đường đi ngắn nhất:**

  - Chọn đỉnh nguồn và đỉnh đích bằng cách nhấp vào đồ thị hoặc nhập ID tương ứng.
  - Chọn thuật toán cần thực hiện (BFS, Dijkstra, A\*, Bellman-Ford, Floyd-Warshall).
  - Xem quá trình thực hiện qua bảng hoặc vùng hiển thị các bước (cập nhật hàng đợi, các đỉnh đã thăm, đường đi nổi bật…).

- **Lưu và mở đồ thị:**
  - Nhấn nút “Lưu đồ thị” để xuất đồ thị thành file JSON.
  - Nhấn nút “Mở đồ thị” để tải file JSON đã lưu và hiển thị lại đồ thị.
  - Nhấn nút “Tạo mới” để xóa đồ thị hiện tại và bắt đầu lại.

---

## Yêu cầu hệ thống

- Hệ điều hành: Windows, macOS hoặc Linux.
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
