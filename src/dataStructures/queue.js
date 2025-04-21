// Lớp Queue triển khai cấu trúc dữ liệu hàng đợi (FIFO - First In, First Out)
class Queue {
    // Khởi tạo hàng đợi
    constructor() {
        this.items = []; // Mảng lưu các phần tử
    }

    // Thêm phần tử vào cuối hàng đợi
    // @param {*} element - Phần tử cần thêm
    enqueue(element) {
        this.items.push(element);
    }

    // Lấy và xóa phần tử ở đầu hàng đợi
    // @returns {*} - Phần tử ở đầu hoặc null nếu rỗng
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // Xem phần tử ở đầu hàng đợi mà không xóa
    // @returns {*} - Phần tử ở đầu hoặc null nếu rỗng
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    // Kiểm tra hàng đợi có rỗng không
    // @returns {boolean} - True nếu hàng đợi rỗng
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = Queue;