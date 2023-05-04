var express = require('express');
var router = express.Router();

const Post = require('../models/Post.model')
const User = require('../models/User.model')
const fileUploader = require('../cloudinary.config.js')

/* GET home page. */
router.get('/', fileUploader.single('imageUrl'), (req, res, next) => {
  Post.find()
    .populate('owner')
    .then((posts) => {
      posts = posts.reverse()
      res.render('index', { posts });
    })
    .catch((err) => {
      console.log(err)
    })
});

module.exports = router;
