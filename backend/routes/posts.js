const { jitOnlyGuardedExpression } = require('@angular/compiler/src/render3/util');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/post');
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

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedPosts;

  const postQuery = Post.find();

  if(currentPage && pageSize) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }

  postQuery.then(documents => {
    fetchedPosts = documents;
    console.log(Post.count())
    return Post.count();
  })
  .then(count => {
    return res.status(200).json({
      message:'Post fetched Successully',
      posts:fetchedPosts,
      maxPosts : count
    });
  });
});

router.put('/:id', authorization, multer({storage : storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;

  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url +"/images/" + req.file.filename;
  }
  console.log(imagePath);

  const post = new Post({
    _id : req.body.id,
    title : req.body.title,
    content : req.body.content,
    imagePath : imagePath
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({
      message: "Update successful!",
      imagePath : result.imagePath
  });
  });
})

router.post("", authorization, multer({storage : storage}).single("image"),(req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title : req.body.title,
    content : req.body.content,
    imagePath : url +"/images/" + req.file.filename
  });

  post.save()
  .then(result => {
    console.log(post);
  res.status(201).json({
    message:"Post Added",
    ...result,
    postId:result._id,
    imagePath : result.imagePath
  });
  });


});

router.delete("/:id", authorization, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log(post);
      res.status(200).json(
        {
          _id : post._id,
          title : post.title,
          content : post.content,
          imagePath : post.imagePath
        }
      );
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
})

module.exports = router;
