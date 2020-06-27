var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require ("connect-flash");
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
// "./" means go back for one layer of dir, "../" two layer
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use('/static', express.static(__dirname+"/src"));
app.use(methodOverride("_method"));
// app.use(function (req, res, next) {
//     res.status(404).send("Sorry can't find that!")
// })
app.set("view engine", "ejs");

// mongoose.connect(process.env.DATABASEURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// });
//for local db, set DABASEURL=mongodb://localhost:27017/yelp_camp_final
//for online set config: DATABASEURL=mongodb+srv://susancat:Just0904%21@cluster0-hcxb6.mongodb.net/test?retryWrites=true&w=majority

mongoose.connect("mongodb://localhost:27017/Hiker",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //if no next, it will stop at middleware
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, function(){
    console.log("Hiker has started");
});
// app.listen(process.env.PORT, process.env.IP);