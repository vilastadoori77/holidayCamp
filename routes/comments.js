var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new comments route
router.get("/new", middleware.isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {

        if (err) {
            console.log(err);
        }
        else {

            res.render("comments/new", { campground: campground });
        }
    });
});

//Post route for the new comment
router.post("/", middleware.isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {

        if (err) {

            console.log(err);
            res.redirect("/campgrounds");
        }
        else {

            Comment.create(req.body.comment, function(err, comment) {
                if (err) {

                    console.log(err);
                }
                else {
                    //add username and comment to the id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("succss", "Successfully added the comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

//comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res) {

    Comment.findById(req.params.comment_id, function(err, foundCommentId) {
        if (err) {
            res.redirect("back");
        }
        else {

            req.flash("success", "Comment successfully deleted");
            res.render("comments/edit", { campground_id: req.params.id, comment: foundCommentId });

        }

    });


});

//comments update route
router.put("/:comment_id", middleware.checkCommentOwnerShip, function(req, res) {

    //res.send("You have hit the update route");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {

        if (err) {
            res.redirect("back");
        }
        else {

            res.redirect("/campgrounds/" + req.params.id);

        }


    });

});


//comments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req, res) {

    //findByIDAndRemove

    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        }
        else {

            res.redirect("/campgrounds/" + req.params.id);
        }

    });

});





module.exports = router;
