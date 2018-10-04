var express = require('express');
var router = express.Router();

// Route for getting all Articles from the db
module.exports = function(app, db) {

    app.get("/", function(req, res) {
        db.Article.find({})
        .populate("note")
        .then(function(dbArticles) {
            res.render('index', {
                article:dbArticles
            });
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    
    app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
        db.Article.find({})
         .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
         .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.get("/notes", function(req, res) {
    // Grab every document in the Articles collection
        db.Note.find({})
            .then(function(dbNote) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNote);
        })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.post("/articles/:id", function(req, res) {
        db.Note.create(req.body)
          .then(function(dbNote) {
            return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}});
          })
          .then(function(updatedArticle) {
            db.Article.find({})
            .populate("note")
            .then(function(dbArticles) {
                // return res.render("index", {
                //     article: dbArticles});
                res.redirect("/");
           })
           .catch(function(err) {
               res.json(err);
            });
          });
    });

    app.post("/delete/:id", function(req, res) {
        db.Note.remove({_id: req.params.id})
        .then(function(resp) {
            res.json(resp);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
};

// return db.Article.find({})
//             .populate("note")
//             .then(function(dbArticles) {
//                 return res.render("index", {
//                     article: dbArticles});