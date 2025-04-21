// Lớp PriorityQueue triển khai hàng đợi ưu tiên với ưu tiên nhỏ nhất được xử lý trước
class PriorityQueue {
    // Khởi tạo hàng đợi
    constructor() {
        this.items = []; // Mảng lưu các cặp {element, priority}
    }

    // Thêm phần tử vào hàng đợi
    // @param {*} element - Phần tử cần thêm
    // @param {number} priority - Độ ưu tiên (số nhỏ hơn được ưu tiên)
    enqueue(element, priority) {
        this.items.push({ element, priority });
        // Sắp xếp mảng theo độ ưu tiên tăng dần
        this.items.sort((a, b) => a.priority - b.priority);
    }

    // Lấy và xóa phần tử có độ ưu tiên nhỏ nhất
    // @returns {*} - Phần tử có độ ưu tiên nhỏ nhất hoặc null nếu rỗng
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().element;
    }

    // Kiểm tra hàng đợi có rỗng không
    // @returns {boolean} - True nếu hàng đợi rỗng
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = PriorityQueue;