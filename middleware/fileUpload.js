const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const MAX_WIDTH = 800;


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const resizeImage = (buffer) => {
  return sharp(buffer)
    .resize(MAX_WIDTH)
    .toBuffer();
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
