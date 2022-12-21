const { authenticate } = require('passport');
const bcrypt = require('bcrypt');
const passport = require('passport');
// mới làm xong config
const localStrategy = require('passport-local').Strategy;
function initialize(getUserByUsername){
    const authenticateUser = (username, password, done) => {
        const user = getUserByUsername(username);
        if (user == null) {
            return done(null, {message: 'username does not exist'})
        }
        try {
            if ( bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'wrong password'})
            }
        } catch (error) {
            return done(error);
        }
    };
    passport.use(new localStrategy({usernameField: 'username'}, authenticateUser));
    passport.serializeUser( (user, done) => {})
    passport.deserializeUser((user, done) => {})
}

module.exports = initialize;