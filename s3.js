const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Key: file.filename,
    Body: fileStream
  };

  return s3.upload(uploadParams).promise();
};
exports.uploadFile = uploadFile;

const downloadFile = async (Key) => {
  const downloadParams = {
    Bucket: bucketName,
    Key
  };

  return s3.getObject(downloadParams).createReadStream();
};

exports.downloadFile = downloadFile;
