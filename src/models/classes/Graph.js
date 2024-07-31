class Graph {
  /**
   * @param {boolean} esDirigido
   */
  constructor(esDirigido = false) {
    this.vertices = {};
    this.aristas = {};
    this.esDirigido = esDirigido;
  }

  /**
   * @param {VerticeGrafo} nuevoVertice
   * @returns {Graph}
   */
  addVertex(nuevoVertice) {
    this.vertices[nuevoVertice.getKey()] = nuevoVertice;

    return this;
  }

  /**
   * @param {string} vertexKey
   * @returns VerticeGrafo
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey];
  }

  /**
   * @param {VerticeGrafo} vertex
   * @returns {VerticeGrafo[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors();
  }

  /**
   * @return {VerticeGrafo[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * @return {AristaGrafo[]}
   */
  getAllAristas() {
    return Object.values(this.aristas);
  }

  /**
   * @param {AristaGrafo} arista
   * @returns {Graph}
   */
  addArista(arista) {
    // Try to find and end start vertices.
    let verticeInicio = this.getVertexByKey(arista.verticeInicio.getKey());
    let verticeFin = this.getVertexByKey(arista.verticeFin.getKey());

    // Insert start vertex if it wasn't inserted.
    if (!verticeInicio) {
      this.addVertex(arista.verticeInicio);
      verticeInicio = this.getVertexByKey(arista.verticeInicio.getKey());
    }

    // Insert end vertex if it wasn't inserted.
    if (!verticeFin) {
      this.addVertex(arista.verticeFin);
      verticeFin = this.getVertexByKey(arista.verticeFin.getKey());
    }

    // Check if arista has been already added.
    if (this.aristas[arista.getKey()]) {
      throw new Error("Arista has already been added before");
    } else {
      this.aristas[arista.getKey()] = arista;
    }

    // Add arista to the vertices.
    if (this.esDirigido) {
      // If graph IS directed then add the arista only to start vertex.
      verticeInicio.addArista(arista);
    } else {
      // If graph ISN'T directed then add the arista to both vertices.
      verticeInicio.addArista(arista);
      verticeFin.addArista(arista);
    }

    return this;
  }

  /**
   * @param {AristaGrafo} arista
   */
  deleteArista(arista) {
    // Delete arista from the list of aristas.
    if (this.aristas[arista.getKey()]) {
      delete this.aristas[arista.getKey()];
    } else {
      throw new Error("Arista not found in graph");
    }

    // Try to find and end start vertices and delete arista from them.
    const verticeInicio = this.getVertexByKey(arista.verticeInicio.getKey());
    const verticeFin = this.getVertexByKey(arista.verticeFin.getKey());

    verticeInicio.deleteArista(arista);
    verticeFin.deleteArista(arista);
  }

  /**
   * @param {VerticeGrafo} verticeInicio
   * @param {VerticeGrafo} verticeFin
   * @return {(AristaGrafo|null)}
   */
  findArista(verticeInicio, verticeFin) {
    const vertex = this.getVertexByKey(verticeInicio.getKey());

    if (!vertex) {
      return null;
    }

    return vertex.findArista(verticeFin);
  }

  /**
   * @return {number}
   */
  getWeight() {
    return this.getAllAristas().reduce((peso, graphArista) => {
      return peso + graphArista.peso;
    }, 0);
  }

  /**
   * Reverse all the aristas in directed graph.
   * @return {Graph}
   */
  reverse() {
    /** @param {AristaGrafo} arista */
    this.getAllAristas().forEach((arista) => {
      // Delete straight arista from graph and from vertices.
      this.deleteArista(arista);

      // Reverse the arista.
      arista.reverse();

      // Add reversed arista back to the graph and its vertices.
      this.addArista(arista);
    });

    return this;
  }

  /**
   * @return {object}
   */
  getVerticesIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length)
      .fill(null)
      .map(() => {
        return Array(vertices.length).fill(Infinity);
      });

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];
        adjacencyMatrix[vertexIndex][neighborIndex] = this.findArista(
          vertex,
          neighbor
        ).peso;
      });
    });

    return adjacencyMatrix;
  }

  /**
   * @return {string}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
module.exports = Graph;
