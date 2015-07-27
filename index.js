var scraper = require("./scraper.js"),
    heroes = require("./heroes.js"),
    express = require('express'),
    app = express();
var dayInMs = 86400000;

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){    
    res.render("app", {heroes: heroes});
});

app.get("/scrape", function(req, res){    
    setTimeout(scraper(), 100);
    res.render("app", {heroes: heroes});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

//setInterval(scraper, dayInMs/4);
