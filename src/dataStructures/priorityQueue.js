class PriorityQueue {
    constructor() {
        this.items = []; // Mảng lưu các cặp [element, priority]
    }

    // Thêm một phần tử với priority (khoảng cách)
    enqueue(element, priority) {
        this.items.push({ element, priority });
        // Sắp xếp lại mảng theo priority (nhỏ nhất lên đầu)
        this.items.sort((a, b) => a.priority - b.priority);
    }

    // Lấy và xóa phần tử có priority nhỏ nhất
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().element;
    }

    // Kiểm tra queue có rỗng không
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = PriorityQueue;