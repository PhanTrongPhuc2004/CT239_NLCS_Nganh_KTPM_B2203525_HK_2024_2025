class Edge {
    constructor(u, v, w) {
        this.u = u; // ID của đỉnh đầu
        this.v = v; // ID của đỉnh cuối
        this.w = w || 0; // Trọng số (có thể âm)
    }

    // Cập nhật trọng số của cạnh
    setWeight(w) { 
        this.w = w;
    }

    // Phương thức kiểm tra xem cạnh có chứa đỉnh với ID cho trước không
    hasVertex(vertexId) {
        return this.u === vertexId || this.v === vertexId;
    }

    // Phương thức lấy đỉnh còn lại của cạnh so với đỉnh cho trước
    getOtherVertex(vertexId) {
        if (this.u === vertexId) return this.v;
        if (this.v === vertexId) return this.u;
        return null;
    }

    // Phương thức chuyển đổi thành JSON để lưu trữ
    toJSON() {
        return {
            u: this.u,
            v: this.v,
            w: this.w,
        };
    }

    // Phương thức tạo Edge từ JSON
    static fromJSON(json) {
        return new Edge(json.u, json.v, json.w);
    }
}

module.exports = Edge;