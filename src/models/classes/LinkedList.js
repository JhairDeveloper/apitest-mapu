const Comparator = require("../../helpers/Comparator");
const LinkedListNode = require("./LinkedListNode");

class LinkedList {
  /**
   * @param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    /** @var LinkedListNode */
    this.cabeza = null;

    /** @var LinkedListNode */
    this.cola = null;

    this.compare = new Comparator(comparatorFunction);
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  prepend(value) {
    // Make new node to be a cabeza.
    const newNode = new LinkedListNode(value, this.cabeza);
    this.cabeza = newNode;

    // If there is no cola yet let's make new node a cola.
    if (!this.cola) {
      this.cola = newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  append(value) {
    const newNode = new LinkedListNode(value);

    // If there is no cabeza yet let's make new node a cabeza.
    if (!this.cabeza) {
      this.cabeza = newNode;
      this.cola = newNode;

      return this;
    }

    // Attach new node to the end of linked list.
    this.cola.next = newNode;
    this.cola = newNode;

    return this;
  }

  /**
   * @param {*} value
   * @param {number} index
   * @return {LinkedList}
   */
  insert(value, rawIndex) {
    const index = rawIndex < 0 ? 0 : rawIndex;
    if (index === 0) {
      this.prepend(value);
    } else {
      let count = 1;
      let currentNode = this.cabeza;
      const newNode = new LinkedListNode(value);
      while (currentNode) {
        if (count === index) break;
        currentNode = currentNode.next;
        count += 1;
      }
      if (currentNode) {
        newNode.next = currentNode.next;
        currentNode.next = newNode;
      } else {
        if (this.cola) {
          this.cola.next = newNode;
          this.cola = newNode;
        } else {
          this.cabeza = newNode;
          this.cola = newNode;
        }
      }
    }
    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedListNode}
   */
  delete(value) {
    if (!this.cabeza) {
      return null;
    }

    let deletedNode = null;

    // If the cabeza must be deleted then make next node that is different
    // from the cabeza to be a new cabeza.
    while (this.cabeza && this.compare.equal(this.cabeza.value, value)) {
      deletedNode = this.cabeza;
      this.cabeza = this.cabeza.next;
    }

    let currentNode = this.cabeza;

    if (currentNode !== null) {
      // If next node must be deleted then make next node to be a next next one.
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // Check if cola must be deleted.
    if (this.compare.equal(this.cola.value, value)) {
      this.cola = currentNode;
    }

    return deletedNode;
  }

  /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
  find({ value = undefined, callback = undefined }) {
    if (!this.cabeza) {
      return null;
    }

    let currentNode = this.cabeza;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteCola() {
    const deletedCola = this.cola;

    if (this.cabeza === this.cola) {
      // There is only one node in linked list.
      this.cabeza = null;
      this.cola = null;

      return deletedCola;
    }

    // If there are many nodes in linked list...

    // Rewind to the last node and delete "next" link for the node before the last one.
    let currentNode = this.cabeza;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.cola = currentNode;

    return deletedCola;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteCabeza() {
    if (!this.cabeza) {
      return null;
    }

    const deletedCabeza = this.cabeza;

    if (this.cabeza.next) {
      this.cabeza = this.cabeza.next;
    } else {
      this.cabeza = null;
      this.cola = null;
    }

    return deletedCabeza;
  }

  /**
   * @param {*[]} values - Array of values that need to be converted to linked list.
   * @return {LinkedList}
   */
  fromArray(values) {
    values.forEach((value) => this.append(value));

    return this;
  }

  /**
   * @return {LinkedListNode[]}
   */
  toArray() {
    const nodes = [];

    let currentNode = this.cabeza;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }

  /**
   * Reverse a linked list.
   * @returns {LinkedList}
   */
  reverse() {
    let currNode = this.cabeza;
    let prevNode = null;
    let nextNode = null;

    while (currNode) {
      // Store next node.
      nextNode = currNode.next;

      // Change next node of the current node so it would link to previous node.
      currNode.next = prevNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset cabeza and cola.
    this.cola = this.cabeza;
    this.cabeza = prevNode;

    return this;
  }
}

module.exports = LinkedList;
