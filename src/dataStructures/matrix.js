// Lớp Matrix triển khai ma trận 2 chiều với giá trị mặc định
class Matrix {
    // Khởi tạo ma trận
    // @param {number} size - Kích thước ma trận (size x size)
    // @param {*} defaultValue - Giá trị mặc định (mặc định là Infinity)
    constructor(size, defaultValue = Infinity) {
        this.size = size;
        // Tạo ma trận với giá trị mặc định
        this.data = Array(size)
            .fill()
            .map(() => Array(size).fill(defaultValue));
    }

    // Lấy giá trị tại vị trí [row][col]
    // @param {number} row - Chỉ số hàng
    // @param {number} col - Chỉ số cột
    // @returns {*} - Giá trị tại vị trí [row][col]
    get(row, col) {
        return this.data[row][col];
    }

    // Gán giá trị tại vị trí [row][col]
    // @param {number} row - Chỉ số hàng
    // @param {number} col - Chỉ số cột
    // @param {*} value - Giá trị cần gán
    set(row, col, value) {
        this.data[row][col] = value;
    }

    // Lấy kích thước ma trận
    // @returns {number} - Kích thước ma trận
    getSize() {
        return this.size;
    }
}

module.exports = Matrix;