const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function Initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);

        if(user == null){
            return done(null, false, {message: "no user found"});
        }

        bcrypt.compare(password, user.password)
            .then(result => {
                if(result == true){
                    return done(null, user);
                }else {
                    return done(null, false, {message: "password dosen't match"});
                }
            }).catch(err => {
                return done(err);
            })
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){

        return next();
    }
    res.redirect('/admin/login');

}

function checkNotAuthenticated(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/dashboard');

}


module.exports = {
    InitPassport:Initialize,
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated
};
