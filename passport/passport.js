const passport = require("passport");
const User = require("../model/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});



passport.use(new GoogleStrategy({
    // !: task 1 >> ask for token 
    // show consent screen --> send token 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    // !: task 2>> bring  info via token help
    // by token acess ask for info to google ---> send info google --> then we acess
    (accessToken, refreshToken, profile, next) => {
        console.log("MY PROFILE", profile);
        User.findOne({ email: profile._json.email }).then((user) => {
            if (user) {
                console.log("User already exits in DB", user);
                next(null, user);
                // cookietoken()
            } else {
                // ! save to db 
                User.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    email: profile._json.email
                })
                    .then((user) => {
                        console.log("New User", user);
                        next(null, user);
                        // cookietoken()
                    })
                    .catch((err) => console.log(err));
            }
        });
        next();
    }
)
);
