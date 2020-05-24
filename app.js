var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
// "./" means go back for one layer of dir, "../" two layer

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v9",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "One again rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//put "currentUser: req.user" in res.locals make it's in all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next(); //if no next, it will stop at middleware
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, function(){
    console.log("YelpCamp has started");
});