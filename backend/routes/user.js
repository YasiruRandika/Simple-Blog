const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {
  console.log(req.body.password);
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    console.log(hash);
    const user = new User(
      {email : req.body.email,
      password : hash}
    );

    user.save()
    .then(result => {
      console.log("Use Created");
      console.log(result);
      res.status(201).json({
        message : 'User Created',
        result : result
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error : err
      })
    })
  });
});

router.post("/login", (req, res, next) => {
  console.log(req.body.email);
  let fetchedUser;
  User.findOne({email : req.body.email})
    .then(user => {
      console.log(user);
      if(!user) {
        return res.status(401).json({
          message : 'Auth Failed'
        });
      }
      fetchedUser = user;

      console.log("User" + fetchedUser.email);
      if(!bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({
          message : 'Auth Failed'
        });
      }

      const token = jwt.sign({email : fetchedUser.email, userId : fetchedUser._id}, "blogtestprojectbyyasirurandikausingangular", {expiresIn:"1h"});

      res.status(200).json({
        token : token,
        expiresIn : 3600,
        userId : fetchedUser._id
      });
    })
    .catch(err => {
      res.status(401).json({
        error : err
      })
    })
  })

module.exports = router;
