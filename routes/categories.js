var express = require("express");
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");

/* GET Posts listing. */
router.get("/show/:category", function (req, res, next) {
  var posts = db.get("posts");

  posts.find({ category: req.params.category }, {}, function (err, posts) {
    res.render("index", {
      title: req.params.category,
      posts: posts,
    });
  });
});

/* GET Posts listing. */
router.get("/add", function (req, res, next) {
  res.render("addcategory", {
    title: "Add Category",
  });
});

router.post("/add", function (req, res, next) {
  //Get form values
  var name = req.body.name;

  //form validation
  req.checkBody("name", "Name field is required").notEmpty();

  //check errors
  var errors = req.validationErrors();

  if (errors) {
    res.render("addcategory", {
      errors: errors,
    });
  } else {
    var categories = db.get("categories");
    categories.insert(
      {
        name: name,
      },
      function (err, post) {
        if (err) {
          res.send(err);
        } else {
          req.flash("success", "Category Added");
          res.location("/");
          res.redirect("/");
        }
      }
    );
  }
});

module.exports = router;
