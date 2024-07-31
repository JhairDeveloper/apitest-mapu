const { uploadImageToS3 } = require("../helpers/s3Helpers");
const { generateQRcode } = require("../helpers/index");
const qr = require("qr-image");

async function uploadImage(req, res, next) {
  try {
    const file = req.file;

    if (!file) {
      return next({
        status: 400,
        message: "No se ha proporcionado ningún archivo",
      });
    }

    const result = await uploadImageToS3(file);

    return res.json({ imageUrl: result.Location });
  } catch (error) {
    // console.error("Error al subir la imagen:", error);
    next(error);
  }
}

const createQR = async (req, res, next) => {
  try {
    const qrData = await generateQRcode(req.body.text);
    const qrCodeImage = qr.image(qrData, { type: "png" });

    const file = {
      originalname: req.body.text,
      buffer: qrCodeImage,
      mimetype: "image/png",
    };

    const imageURL = await uploadImageToS3(file);
    res.json(imageURL.Location);
  } catch (err) {
    // throw err;
    next(err);
  }
};

module.exports = {
  uploadImage,
  createQR,
};
