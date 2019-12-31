const express = require('express');
const firebase = require('firebase-admin');

const secrets = require('./secrets.js');

/* EXPRESS CONFIG */
const app = express();

/* FIREBASE CONFIG */
firebase.initializeApp({
  databaseURL: "https://crossword-stats.firebaseio.com",
  credential: firebase.credential.cert(secrets.firebaseServerConfig)
});
const db = firebase.firestore();

app.use(express.static('dist'));

app.get('/', function(request, response) {
  let fileName = request.path;
  if(request.path === '/') { fileName = "/index.html"; }
  response.sendFile(__dirname + '/dist/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
