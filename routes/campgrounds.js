var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
    //get all campgrounds from DB by find(), the following :campgrounds are not from params anymore
    Campground. find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else {
            // console.log("found campgrounds");
            res.render("./campgrounds/index", {campgrounds: allCampgrounds}); //if we want to pass any var, can add inside {}
        }
    });
});

//route principle: better to name the post page name the same with the above
router.post("/", isLoggedIn, function(req, res){
    var site = req.body.site;
    var image = req.body.image;
    var des = req.body.des;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: site, image: image, description: des, author: author};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newly){
            if (err) {
                console.log(err);
            }else {
                // console.log(newly);
                res.redirect("/campgrounds");
            }
        });
    });
    // campgrounds.push({name: site, image: image});

//new gain the data and send
router.get("/new", isLoggedIn, function(req, res){ //notice about "/" important!!
    res.render("./campgrounds/new"); // the form
});

//show certain particular campground with more details
router.get("/:id", function(req, res){
    //we need to provide id for the item by req.params.id
    //then find the item by id
    Campground.findById(req.params.id).populate("comments"). exec(function(err, foundCamp){
        if(err) {
            console.log(err);
        }else{
            res.render("./campgrounds/show", {campground: foundCamp});
        }
    });
});

module.exports = router;

//middleware to check if logged in
function isLoggedIn(req, res, next) {
    if(req. isAuthenticated()){ //if logged in, show the next page
        return next();
    }
    res.redirect("/login"); //otherwise go back to login
}

