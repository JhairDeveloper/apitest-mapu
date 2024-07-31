const FailedRequest = require("../models/FailedRequest");

const errorHandler = async (error, req, res, next) => {
  console.log({ error });

  const status = error.status || 500;
  const message = error.message || "Ocurrió un error en el servidor";
  const details = error.details || null;
  const code = error.code || undefined;

  // Crear un nuevo documento FailedRequest
  const failedRequest = await FailedRequest.create({
    url: req.url,
    method: req.method,
    statusCode: status,
    message: error.message,
    params: req.params,
    queries: req.query,
    body: req.body,
  }).catch(console.log);

  res.status(status).json({ message, details, code });
};

module.exports = errorHandler;
