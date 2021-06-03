const express = require('express');
const router = express.Router();

const multer = require('multer');
const AWS = require('aws-sdk');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add-photo', upload.single('file'), async (req, res) => {
  let info = req.body;
  const image = req.file;

  const { folder, id } = req.body;

  const s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KET,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/` + image.originalname,
    Body: image.buffer,
    ContentType: image.mimetype,
    ACL: 'public-read',
  };

  s3bucket.upload(params, async (err, data) => {
    try {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true, Message: err });
      } else {
        const newFileUploaded = {
          description: info.description,
          fileLink: process.env.AWS_S3_UPLOAD_URL + image.originalname,
          s3_key: params.Key,
        };

        console.log(newFileUploaded);
        info = { ...info, photo: newFileUploaded.fileLink };

        imageUrl = `https://fire-app-photos.s3.amazonaws.com/${folder}/${image.originalname}`;

        // Now save this image url to database
        await knex(tableNames.userComplaints)
          .select()
          .where({
            user_id: id,
          })
          .update('image_url', imageUrl);

        res
          .status(201)
          .send({ msg: 'Image added to amazon s3', imageUrl: imageUrl });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'Server Error', error: err });
    }
  });
});

module.exports = router;
