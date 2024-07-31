const ValidationError = require("../../errors/ValidationError");
const LinkedList = require("./LinkedList");

class VerticeGrafo {
  /**
   * @param {*} value
   */
  constructor(value) {
    if (value === undefined) {
      throw new ValidationError("El vértice del grafo debería tener un valor");
    }

    /**
     * @param {AristaGrafo} aristaA
     * @param {AristaGrafo} aristaB
     */
    const compararAristas = (aristaA, aristaB) => {
      if (aristaA.getKey() === aristaB.getKey()) {
        return 0;
      }

      return aristaA.getKey() < aristaB.getKey() ? -1 : 1;
    };

    // Normally you would store string value like vertex name.
    // But generally it may be any object as well
    this.value = value;
    this.aristas = new LinkedList(compararAristas);
  }

  /**
   * @param {AristaGrafo} arista
   * @returns {VerticeGrafo}
   */
  addArista(arista) {
    this.aristas.append(arista);

    return this;
  }

  /**
   * @param {AristaGrafo} arista
   */
  deleteArista(arista) {
    this.aristas.delete(arista);
  }

  /**
   * @returns {VerticeGrafo[]}
   */
  getNeighbors() {
    const aristas = this.aristas.toArray();

    /** @param {LinkedListNode} node */
    const neighborsConverter = (node) => {
      return node.value.verticeInicio === this
        ? node.value.verticeFin
        : node.value.verticeInicio;
    };

    // Return either start or end vertex.
    // For undirected graphs it is possible that current vertex will be the end one.
    return aristas.map(neighborsConverter);
  }

  /**
   * @return {AristaGrafo[]}
   */
  getAristas() {
    return this.aristas.toArray().map((linkedListNode) => linkedListNode.value);
  }

  /**
   * @return {number}
   */
  getDegree() {
    return this.aristas.toArray().length;
  }

  /**
   * @param {AristaGrafo} requiredArista
   * @returns {boolean}
   */
  hasArista(requiredArista) {
    const aristaNode = this.aristas.find({
      callback: (arista) => arista === requiredArista,
    });

    return !!aristaNode;
  }

  /**
   * @param {VerticeGrafo} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.aristas.find({
      callback: (arista) =>
        arista.verticeInicio === vertex || arista.verticeFin === vertex,
    });

    return !!vertexNode;
  }

  /**
   * @param {VerticeGrafo} vertex
   * @returns {(AristaGrafo|null)}
   */
  findArista(vertex) {
    const aristaFinder = (arista) => {
      return arista.verticeInicio === vertex || arista.verticeFin === vertex;
    };

    const arista = this.aristas.find({ callback: aristaFinder });

    return arista ? arista.value : null;
  }

  /**
   * @returns {string}
   */
  getKey() {
    return this.value;
  }

  /**
   * @return {VerticeGrafo}
   */
  deleteAllAristas() {
    this.getAristas().forEach((arista) => this.deleteArista(arista));

    return this;
  }

  /**
   * @param {function} [callback]
   * @returns {string}
   */
  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

module.exports = VerticeGrafo;
