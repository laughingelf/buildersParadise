var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs')
saltRounds = 10

const User = require('../models/User.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')


router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login.hbs')
})

router.post('/login', isLoggedOut, (req, res, next) => {
    const { email, password } = req.body
    console.log(req.body)

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Incorrect Email/Password' })
                return
            } else if (bcryptjs.compareSync(password, user.password)) {
                req.session.user = user
                console.log('the user is: ', user)
                res.redirect('/')
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect Email/Password' })
            }
        })
        .catch((err) => {
            console.log(err)
        })
})


router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }

    //check the password strength
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(passwordHash => {
            return User.create({
                // username: username
                username,
                email,
                // passwordHash => this is the key from the User model
                //     ^
                //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
                password: passwordHash
            });
        })
        .then((createdUser) => {
            req.session.user = createdUser
            res.redirect('/users/profile')
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err)
        }
        res.redirect('/')
    })
})


module.exports = router;