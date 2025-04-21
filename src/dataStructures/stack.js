// Lớp Stack triển khai cấu trúc dữ liệu ngăn xếp (LIFO - Last In, First Out)
class Stack {
    // Khởi tạo ngăn xếp
    constructor() {
        this.items = []; // Mảng lưu các phần tử
    }

    // Thêm phần tử vào đỉnh ngăn xếp
    // @param {*} element - Phần tử cần thêm
    push(element) {
        this.items.push(element);
    }

    // Lấy và xóa phần tử ở đỉnh ngăn xếp
    // @returns {*} - Phần tử ở đỉnh hoặc null nếu rỗng
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    // Xem phần tử ở đỉnh ngăn xếp mà không xóa
    // @returns {*} - Phần tử ở đỉnh hoặc null nếu rỗng
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // Kiểm tra ngăn xếp có rỗng không
    // @returns {boolean} - True nếu ngăn xếp rỗng
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = Stack;