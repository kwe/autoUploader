const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('dotenv').config();

// create express app
const app = express();

// upload file path
const FILE_PATH = process.env.UPLOAD_PATH;

// configure multer

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${FILE_PATH}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  limits: {
    files: 1, // allow 1 file per request,
    fieldSize: 10 * 1024 * 1024, // 10 MB (max file size)
  },
  fileFilter: (req, file, cb) => {
    // allow images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
  },
  storage: storage
});

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// upload single file
app.post('/upload-picture', upload.single('picture'), async (req, res) => {
  try {
    const picture = req.file;

    // check for Token
    let token = req.header('TOKEN');

    if (token != process.env.TOKEN) {
      res.status(403).send({
        status: false,
        message: 'FAIL',
        data: 'Unauthorized.'
      });
      return;
    }

    // make sure file is available
    if (!picture) {
      res.status(400).send({
        status: false,
        message: 'FAIL',
        data: 'No file sent selected.',
      });
    } else {
      //send response
      res.send({
        status: true,
        message: 'OK',
        data: {
          name: picture.originalname,
          mimetype: picture.mimetype,
          size: picture.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// start the app
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}.`));
