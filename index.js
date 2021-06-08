const express = require("express");
const multer = require("multer");
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const util = require("util");
require("dotenv").config();

const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, downloadFile } = require("./s3");

var upload = multer({ dest: "uploads/" });

const app = express();

app.get("/", (req, res) => {
  res.send({
    "post image to s3": "POST- /image",
    "get image from s3": "GET- /image/:key"
  });
});

app.post("/image", upload.single("image"), async (req, res) => {
  const result = await uploadFile(req.file);

  //Unlink file from server upload directory
  unlinkFile(req.file.path);

  res.send({
    // response: result,
    info: "To access image request to GET- /image/" + result.key
  });
});

app.get("/image/:key", async (req, res) => {
  const key = req.params.key;
  const result = await downloadFile(key);
  result.pipe(res); // a easy way to bind the file stream , direct to res object
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is up and running at " + PORT);
});
