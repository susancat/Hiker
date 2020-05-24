var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj. checkOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
                if(err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                }else {
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next(); 
                    //maybe want to update or delete, next thing user want to do
                    }
                    else {
                        req.flash("error", "You don't have permission!");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }   
}

middlewareObj. checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err) {
                    res.redirect("back");
                }else {
                    if(foundComment.author.id.equals(req.user._id)) {
                        next(); 
                    //maybe want to update or delete, next thing user want to do
                    }
                    else {
                        req.flash("error", "You don't have permission!");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }   
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req. isAuthenticated()){ //if logged in, show the next page
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login"); //otherwise go back to login
}

module.exports = middlewareObj;