var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var csv = require('ya-csv');
var app = express();
app.use(express.static(path.join(__dirname, "")));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "pages/index.html"));
});

    app.post('/score', function(request, response){
        var name = request.body.fullName;       1
        var email = request.body.email;         1
        var score = request.body.score;         1

        var database = csv.createCsvFileWriter("scores.csv", {"flags": "a"}); 2
        var data = [name, email, score];        3

        database.writeRecord(data);             4
        database.writeStream.end();             5

        response.send("Thanks " + name + ", your score has been recorded!"); 6
    });

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Bob's Flappy Bird listening at http://%s:%s", host, port);
});
