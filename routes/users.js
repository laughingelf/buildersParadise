var express = require('express');
var router = express.Router();

const User = require('../models/User.model')
const Post = require('../models/Post.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  const user = req.session.user
  User.findById(user._id)
    .then((user) => {
      Post.find({ owner: user._id })
        .then((posts) => {
          posts = posts.reverse()
          res.render('users/user-homepage.hbs', { user, posts })
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/update-profile/:id', isLoggedIn, (req, res, next) => {
  const user = req.session.user
  User.findById(user._id)
    .then((user) => {
      res.render('users/update-profile.hbs', user)
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/update-profile/:id', isLoggedIn, (req, res, next) => {
  const { id } = req.params
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((updated) => {
      res.redirect('/users/profile')
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/all-builders', isLoggedIn, (req, res, next) => {
  User.find()
    .then((builders) => {
      res.render('users/all-builders.hbs', { builders })
    })
})

router.get('/builder-profile/:id', isLoggedIn, (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .then((user) => {
      res.render('users/builder-profile.hbs', user)
    })
})

module.exports = router;
