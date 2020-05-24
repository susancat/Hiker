var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

//sign up page
router.get("/register", function(req, res){
    res.render("register");
});

//get sign up
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.render("register");
       }passport.authenticate("local")(req, res, function(){
        req.flash("success","Welcome to YelpCamp " + user.username);   
        res.redirect("/campgrounds");
       });
   });
});
//login
router.get("/login", function(req, res){
    res.render("login");
});
// the below equals to app.post("/login", middleware, callback),middleware will call localstrategy
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
//it did nothing, just let us aware the middleware
});

//log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/campgrounds");
});

module.exports = router;
