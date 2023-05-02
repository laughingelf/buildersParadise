var express = require('express');
var router = express.Router();

const Post = require('../models/Post.model')
const User = require('../models/User.model')

/* GET home page. */
router.get('/', function (req, res, next) {
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
