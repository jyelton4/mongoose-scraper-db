var express = require('express');
var router = express.Router();
var request = require('request-promise');
var cheerio = require('cheerio');

/* GET home page. */
// A GET route for scraping the echoJS website
module.exports = function(app, db) {
    
    app.get("/", function(req, res) {
        var options = {
            uri: "https://www.npr.org/sections/news/", 
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        // First, we grab the body of the html with request
        request(options).then(function($) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        // var $ = cheerio.load(response.data);
    
            // Now, we grab every h2 within an article tag, and do the following:
            $("article div.item-info").each(function(i, element) {
                // Save an empty result object
                var result = {};
        
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                .children("h2")
                .children(".title a")
                .text();
                result.link = $(this)
                .children("h2")
                .children(".title a")
                .attr("href");
                result.summary = $(this)
                .children("p")
                .children(".teaser a")
                .text();

                //
                function createDoc() {
                    db.Article.create(result)
                    .then(function(dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
                    console.log(result);
                }
                
                db.Article.findOne({ title: result.title })
                .then(function(dbArticle) {
                    if (!dbArticle) {
                        createDoc(dbArticle);
                    };
                })
                .catch(function(err) {
                    res.json(err);
                })
            });
    
        // If we were able to successfully scrape and save an Article, send a message to the client
        
        })
        .then(function(resp) {
            res.redirect("/home");
        });
    });
};
