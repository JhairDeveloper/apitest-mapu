const errorNotFound = (req, res, next) => {
  const error = new Error(`La página solicitada ${req.url} no se encontró`);
  error.status = 404;
  next(error);
};

module.exports = errorNotFound;
