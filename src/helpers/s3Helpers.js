const AWS = require("aws-sdk");
const path = require("path");
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env;
const { Types } = require("mongoose");

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

function uploadImageToS3(file, ext, folder, buffer = false) {
  const fileExtension = ext ? `.${ext}` : path.extname(file.originalname);
  const fileName = `${Date.now().toString()}_${new Types.ObjectId()}${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: folder ? `${folder}/${fileName}` : fileName,
    Body: buffer ? file : file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return s3.upload(uploadParams).promise();
}

module.exports = {
  uploadImageToS3,
};
