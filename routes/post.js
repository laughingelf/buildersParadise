var express = require('express');
var router = express.Router();

const { isLoggedIn, isLoggedOut, isOwner } = require('../middleware/route-guard')

const Post = require('../models/Post.model')
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const fileUploader = require('../cloudinary.config.js')

router.get('/new-post', isLoggedIn, (req, res, next) => {
    res.render('post/new-post.hbs')
})

router.post('/new-post', isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {
    const { title, description, imageUrl } = req.body
    console.log('this is the REQUREST FILE: ', req)
    Post.create(
        {
            title,
            description,
            imageUrl: req.file.path,
            owner: req.session.user._id

        })
        .then((newPost) => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/update-post/:id', isLoggedIn, (req, res, next) => {
    const { id } = req.params
    Post.findById(id)
        .then((post) => {
            res.render('post/update-post.hbs', post)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/update-post/:id', isLoggedIn, (req, res, next) => {
    const { id } = req.params
    Post.findByIdAndUpdate(id, req.body, { new: true })
        .then((post) => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/post-details/:id', isLoggedIn, (req, res, next) => {
    const { id } = req.params
    Post.findById(id)
        .populate('owner')
        .populate({
            path: "comments",
            populate: { path: "username" }
        })
        .then((post) => {
            console.log(post)
            res.render('post/post-details.hbs', post)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/search-posts', isLoggedIn, (req, res, next) => {
    const { search } = req.query
    // console.log(search)
    User.find({ $or: [{ username: { $regex: search } }, { firstName: { $regex: search } }] })
        .then((builderRes) => {
            Post.find({ $or: [{ title: { $regex: search } }, { description: { $regex: search } }] })
                .then((postRes) => {
                    console.log('builders RESULTS', builderRes)
                    console.log('Posts RESULTS', postRes)
                    res.render('post/search-posts.hbs', { builderRes, postRes })
                })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/add-comment', isLoggedIn, (req, res, next) => {
    const { comment, id } = req.body
    console.log('REQUESTS', req.params)
    Comment.create(
        {
            username: req.session.user._id,
            comment
        })
        .then((createdComment) => {
            console.log('❤', createdComment._id)
            Post.findByIdAndUpdate(id, { $push: { comments: createdComment._id } })
                .then(() => {
                    res.redirect(`/post/post-details/${id}`)
                })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/delete/:id', (req, res, next) => {
    const { id } = req.params
    Post.findByIdAndDelete(id)
        .then((post) => {
            res.redirect('/users/profile')
        })
        .catch((err) => {
            console.log(err)
        })
})


module.exports = router;

router.get('/delete/:id', (req, res, next) => {
    const { id } = req.params
    Activity.findByIdAndDelete(id)
        .then((post) => {
            res.redirect('/all-activities')
        })
        .catch((err) => {
            console.log(err)
        })
})