const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://max:xBuMakWaLkfF65BH@cluster0.ooist.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err)
      console.error(err);
  else
      console.log("Connected to the mongodb");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
  .then(documents => {
    return res.status(200).json({
      message:'Post fetched Successully',
      posts:documents
    });
  });
});

app.post("/api/post", (req, res, next) => {
  const post = new Post({
    title : req.body.title,
    content : req.body.content
  });

  post.save()
  .then(result => {
    console.log(post);
  res.status(201).json({
    message:"Post Added",
    postId:result._id
  });
  });


});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
