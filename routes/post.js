var express = require('express');
var router = express.Router();

const Post = require('../models/Post.model')
const User = require('../models/User.model')

router.get('/new-post', (req, res, next) => {
    res.render('post/new-post.hbs')
})

router.post('/new-post', (req, res, next) => {
    const { title, description, imageUrl } = req.body
    Post.create(
        {
            title,
            description,
            imageUrl,
            owner: req.session.user._id

        })
        .then((newPost) => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/update-post/:id', (req, res, next) => {
    const { id } = req.params
    Post.findById(id)
        .then((post) => {
            res.render('post/update-post.hbs', post)
        })
})

router.post('/update-post/:id', (req, res, next) => {
    const { id } = req.params
    Post.findByIdAndUpdate(id, req.body, { new: true })
        .then((post) => {
            res.redirect('/')
        })
})

router.get('/post-details/:id', (req, res, next) => {

})



module.exports = router;