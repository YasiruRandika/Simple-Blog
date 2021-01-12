const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const multer = require('multer');


const authorization = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.get('', postController.getPosts);

router.put('/:id', authorization, multer({storage : storage}).single("image"), postController.updatePost);

router.post("", authorization, multer({storage : storage}).single("image"), postController.createPost);

router.delete("/:id", authorization, postController.deletePost);

router.get("/:id", postController.getPostById);

module.exports = router;
