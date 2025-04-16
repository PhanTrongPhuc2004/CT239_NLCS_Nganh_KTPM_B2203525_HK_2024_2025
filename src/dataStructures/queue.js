class Queue {
    constructor() {
        this.items = [];
    }

    // Thêm một phần tử vào cuối queue
    enqueue(element) {
        this.items.push(element);
    }

    // Lấy và xóa phần tử ở đầu queue
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // Xem phần tử ở đầu queue mà không xóa
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    // Kiểm tra queue có rỗng không
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = Queue;