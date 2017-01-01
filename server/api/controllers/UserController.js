/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login() {

    },
    logout(req, res) {
        req.session.user = null;
    },
    'facebook': function(req, res, next) {
        passport.authenticate('facebook', { scope: ['email', 'user_about_me'] },
            function(err, user) {
                req.logIn(user, function(err) {
                    if (err) {
                        req.session.flash = 'There was an error';
                        res.redirect('user/login');
                    } else {
                        req.session.user = user;
                        res.redirect('/user/dashboard');
                    }
                });
            })(req, res, next);
    },

    'facebook/callback': function(req, res, next) {
        passport.authenticate('facebook',
            function(req, res) {
                res.redirect('/user/dashboard');
            })(req, res, next);
    }

};
