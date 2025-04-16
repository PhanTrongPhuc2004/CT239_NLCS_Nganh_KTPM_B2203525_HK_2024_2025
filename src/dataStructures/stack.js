class Stack {
    constructor() {
        this.items = [];
    }

    // Thêm một phần tử vào đỉnh stack
    push(element) {
        this.items.push(element);
    }

    // Lấy và xóa phần tử ở đỉnh stack
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    // Xem phần tử ở đỉnh stack mà không xóa
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // Kiểm tra stack có rỗng không
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = Stack;