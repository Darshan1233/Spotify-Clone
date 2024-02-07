const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_PASSWORD + "@cluster0.lxo6nq4.mongodb.net/?retryWrites=true&w=majority", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then((x) => {
    console.log("Connected to Mongo");
})
.catch((err) => {
    console.log("Error while connecting to Mongo");
});

//setup passport-jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

app.get("/", (req,res) => {
    res.send("Hello World");
})

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

app.listen(port, () => {
    console.log("App is running on port " + port);
})