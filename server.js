var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models/Index");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.json());

// Connect to the Mongo DB

// mongoose.connect("mongodb://localhost/week18Populater", { useNewUrlParser: true });
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Set Handlebars.
var exphbs = require("express-handlebars");

//
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs"}));
app.set("view engine", "hbs");

// Routes

// Require all routes
require("./routes/scrape")(app, db);
require("./routes/articlesdb")(app, db);

// Start the server

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// Export

module.exports = app;