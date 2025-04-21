class Vertex {
    constructor(id, label, x, y) {
        this.id = id;
        this.label = label || id.toString();
        this.x = x;
        this.y = y;
    }

    setLabel(label) {
        this.label = label;
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            x: this.x,
            y: this.y,
        };
    }

    static fromJSON(json) {
        return new Vertex(json.id, json.label, json.x, json.y);
    }
}

Vertex.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};

Vertex.prototype.getPosition = function () {
    return { x: this.x, y: this.y };
};

module.exports = Vertex;