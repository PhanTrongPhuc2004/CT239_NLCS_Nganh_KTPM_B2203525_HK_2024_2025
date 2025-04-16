class Matrix {
    constructor(size, defaultValue = Infinity) {
        this.size = size;
        this.data = Array(size)
            .fill()
            .map(() => Array(size).fill(defaultValue));
    }

    // Lấy giá trị tại vị trí [row][col]
    get(row, col) {
        return this.data[row][col];
    }

    // Gán giá trị tại vị trí [row][col]
    set(row, col, value) {
        this.data[row][col] = value;
    }

    // Lấy kích thước ma trận
    getSize() {
        return this.size;
    }
}

module.exports =  Matrix;