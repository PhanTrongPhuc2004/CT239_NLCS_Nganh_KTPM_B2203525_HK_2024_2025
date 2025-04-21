// Lớp Edge đại diện cho một cạnh trong đồ thị
class Edge {
    // Khởi tạo cạnh
    // @param {number} u - ID đỉnh đầu
    // @param {number} v - ID đỉnh cuối
    // @param {number} w - Trọng số cạnh
    constructor(u, v, w) {
        this.u = u;
        this.v = v;
        this.w = w || 0;
    }

    // Cập nhật trọng số cạnh
    // @param {number} w - Trọng số mới
    setWeight(w) {
        this.w = w;
    }

    // Kiểm tra xem cạnh có chứa đỉnh không
    // @param {number} vertexId - ID đỉnh
    // @returns {boolean} - True nếu cạnh chứa đỉnh
    hasVertex(vertexId) {
        return this.u === vertexId || this.v === vertexId;
    }

    // Lấy đỉnh còn lại của cạnh
    // @param {number} vertexId - ID đỉnh
    // @returns {number|null} - ID đỉnh còn lại hoặc null nếu không hợp lệ
    getOtherVertex(vertexId) {
        if (this.u === vertexId) return this.v;
        if (this.v === vertexId) return this.u;
        return null;
    }

    // Chuyển cạnh thành JSON
    // @returns {Object} - Đối tượng JSON chứa u, v, w
    toJSON() {
        return {
            u: this.u,
            v: this.v,
            w: this.w
        };
    }

    // Tạo cạnh từ JSON
    // @param {Object} json - Dữ liệu JSON chứa u, v, w
    // @returns {Edge} - Đối tượng cạnh mới
    static fromJSON(json) {
        return new Edge(json.u, json.v, json.w);
    }
}

module.exports = Edge;