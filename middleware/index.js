var middlewareObj = {}
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//Middleware to check campground ownership
middlewareObj.checkCampGroundOwnerShip = function(req, res, next) {

    if (req.isAuthenticated()) {

        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {

                req.flash("error", "Campground not found");
                res.redirect("/camprounds");
            }
            else {
                //check if the user owns the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    //alert("You are not the owner of this campground");
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("/campgrounds");
                }

            }
        });
    }
    else {
        //console.log("YOU SHOULD LOGIN");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/campgrounds");
    }
};


//Middleware to check comment ownership
middlewareObj.checkCommentOwnerShip = function(req, res, next) {

    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {

                req.flash("error", "Something went wrong when adding the comment");
                res.redirect("back");
            }
            else {
                //check if the user owns the campground
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    //alert("You are not the owner of this campground");
                    req.flash("error", "You do not have permissions to do that");
                    res.redirect("back");
                }

            }
        });
    }
    else {
        //console.log("YOU SHOULD LOGIN");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/campgrounds");
    }
};

//Middleware to check is logged in
middlewareObj.isLoggedIn = function(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "You need to be logged in to do that");

    res.redirect("/login");
};

module.exports = middlewareObj;
