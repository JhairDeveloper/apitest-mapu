module.exports = class AristaGrafo {
  /**
   * @param {VerticeGrafo} verticeInicio
   * @param {VerticeGrafo} verticeFin
   * @param {number} peso
   */
  constructor(verticeInicio, verticeFin, peso = 0) {
    this.verticeInicio = verticeInicio;
    this.verticeFin = verticeFin;
    this.peso = peso;
  }

  /**
   * @return {string}
   */
  getKey() {
    const keyVerticeInicio = this.verticeInicio.getKey();
    const keyVerticeFin = this.verticeFin.getKey();

    return `${keyVerticeInicio}_${keyVerticeFin}`;
  }

  /**
   * @return {AristaGrafo}
   */
  reverse() {
    // Intercambio el inicio por el fin
    const aux = this.verticeInicio;
    this.verticeInicio = this.verticeFin;
    this.verticeFin = aux;

    return this;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.getKey();
  }
};
