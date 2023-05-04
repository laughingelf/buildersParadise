var express = require('express');
var router = express.Router();

const User = require('../models/User.model')
const Post = require('../models/Post.model')
const { isLoggedIn, isLoggedOut, isOwner } = require('../middleware/route-guard')
const fileUploader = require('../cloudinary.config.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', isLoggedIn, fileUploader.single('profilePic'), (req, res, next) => {
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
      Post.find({ owner: user._id })
        .then((posts) => {
          posts = posts.reverse()
          res.render('users/builder-profile.hbs', { user, posts })
        })
    })
})

router.get('/create-profile/:id', isLoggedIn, (req, res, next) => {
  const id = req.session.user._id
  User.findById(id)
    .then((user) => {
      res.render('users/create-profile.hbs', user)
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/create-profile/:id', fileUploader.single('imageUrl'), isLoggedIn, (req, res, next) => {
  const id = req.session.user._id
  User.findByIdAndUpdate(id,
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      craft: req.body.craft,
      years: req.body.years,
      imageUrl: req.file.path
    },
    { new: true })
    .then((updatedUser) => {
      res.redirect('/users/profile')
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/delete-user/:id', (req, res, next) => {
  const { id } = req.params
  User.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;
