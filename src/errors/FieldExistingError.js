class FieldExistingError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "FieldExistingError";
    this.status = status;
  }
}
  
module.exports = FieldExistingError;
  