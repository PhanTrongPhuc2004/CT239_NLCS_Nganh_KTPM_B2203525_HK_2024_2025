class Vertex {
    constructor(id, label, x, y) {
        this.id = id; // ID duy nhất của đỉnh
        this.label = label; // Nhãn hiển thị (có thể trùng với ID)
        this.x = x; // Tọa độ x
        this.y = y; // Tọa độ y
    }

    // Phương thức chuyển đổi thành JSON để lưu trữ
    toJSON() {
        return {
            id: this.id,
            label: this.label,
            x: this.x,
            y: this.y,
        };
    }

    // Phương thức tạo Vertex từ JSON
    static fromJSON(json) {
        return new Vertex(json.id, json.label, json.x, json.y);
    }
}

Vertex.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};

//
Vertex.prototype.getPosition = function () {
    return { x: this.x, y: this.y };
};

module.exports = Vertex;