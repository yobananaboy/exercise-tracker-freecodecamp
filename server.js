// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
const bodyParser = require('body-parser');

const db = require('./server/database');

app.use(bodyParser.urlencoded({extended: false}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// add new user
app.post('/api/exercise/new-user', function(request, response) {
  db.addNewUser(request.body.username, response);
});

app.post('/api/exercise/add', function(request, response) {
  db.addNewExercise(request.body.userId, {"description": request.body.description, "duration": request.body.duration, "date": request.body.date}, response);
});

app.get('/api/exercise/log', function(request, response) {
  console.log(request.query);
  db.getUserExerciseLog(request.query, response);  
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
