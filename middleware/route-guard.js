// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const isOwner = (req, res, next) => {

    Comment.findById(req.params.id)
        .then((user) => {
            if (!req.session.user || user.toString() !== req.session.user._id) {
                res.render('index.hbs', { errorMessage: "You are not authorized." })
            } else {
                next()
            }
        })
        .catch((err) => {
            console.log(err)
        })

}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isOwner
};
