var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    if (req.query.search) {
        var noMatch = null;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground. find({name: regex}, function(err,allCampgrounds){
            if(err){
                console.log(err);
            }else {
                if(allCampgrounds.length < 1){
                    noMatch = 'No trail match that query, please try again!';
                }// console.log("found campgrounds");
                res.render("./campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    } else { 
        Campground. find({}, function(err,allCampgrounds){
            if(err){
                console.log(err);
            }else {
                // console.log("found campgrounds");
                res.render("./campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch}); //if we want to pass any var, can add inside {}
            }
        });
    }
    //get all campgrounds from DB by find(), the following :campgrounds are not from params anymore
    
});

//route principle: better to name the post page name the same with the above
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var level = req.body.level;
    var image = req.body.image;
    var des = req.body.des;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, level: level, image: image, description: des, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){ //notice about "/" important!!
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    }); //the above is the next()
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds");
        }
    });
});

//fuzzy search in mongoDB
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

