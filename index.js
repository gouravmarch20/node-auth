require("dotenv").config();

const express = require("express");
const cookieSession = require('cookie-session')
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const passportConfig = require("./passport/passport");
const passport = require("passport");
const app = express();

const connectWithDb = require("./config/db");


app.use(
    cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,// session expiry time
        keys: [process.env.COOKIE_SESSION], // like json secret key 
    })
);
// passport
app.use(passport.initialize());
app.use(passport.session());

// connect with databases
connectWithDb();

const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect("/auth/login");
    }
    next();
};

app.set("view engine", "ejs");
app.use("/auth", auth);

app.get("/", isLoggedIn, (req, res) => {
    res.render("home");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT}`);
});
