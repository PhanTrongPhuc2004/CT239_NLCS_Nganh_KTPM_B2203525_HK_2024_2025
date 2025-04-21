// Lớp Vertex đại diện cho một đỉnh trong đồ thị
class Vertex {
    // Khởi tạo đỉnh
    // @param {number} id - ID của đỉnh
    // @param {string} label - Nhãn của đỉnh
    // @param {number} x - Tọa độ x
    // @param {number} y - Tọa độ y
    constructor(id, label, x, y) {
        this.id = id;
        this.label = label || id.toString();
        this.x = x;
        this.y = y;
    }

    // Cập nhật nhãn của đỉnh
    // @param {string} label - Nhãn mới
    setLabel(label) {
        this.label = label;
    }

    // Cập nhật vị trí của đỉnh
    // @param {number} x - Tọa độ x mới
    // @param {number} y - Tọa độ y mới
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // Lấy vị trí của đỉnh
    // @returns {Object} - Tọa độ {x, y}
    getPosition() {
        return { x: this.x, y: this.y };
    }

    // Chuyển đỉnh thành JSON
    // @returns {Object} - Đối tượng JSON chứa id, label, x, y
    toJSON() {
        return {
            id: this.id,
            label: this.label,
            x: this.x,
            y: this.y
        };
    }

    // Tạo đỉnh từ JSON
    // @param {Object} json - Dữ liệu JSON chứa id, label, x, y
    // @returns {Vertex} - Đối tượng đỉnh mới
    static fromJSON(json) {
        return new Vertex(json.id, json.label, json.x, json.y);
    }
}

module.exports = Vertex;