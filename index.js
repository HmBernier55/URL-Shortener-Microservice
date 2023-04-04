require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
let mongoose = require('mongoose');

// Connecting to MongoDB database
mongoose.connect("mongodb+srv://hunterbernier:Futbol10@cluster0.kmkggsk.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true});

// Testing the connection to the database
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Connection established!");
});

// Basic Configuration
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));


// Initializing the schema of the data
let urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let newURL = mongoose.model("newURL", urlSchema);


// FRONT END
// Created by FCC
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// BACK END

app.post('/api/shorturl', function(req, res) {
/*
Inputs:
  A correctly formatted URL (https://<website URL> or http://<website URL>)

Outputs:
  If the inputted URL is not formatted correctly:
    {
      error: "invalid url"
    }
  Otherwise, a json object will return with the following format:
    {
      original_url: "inputted URL string",
      short_url: random integer
    }
*/
  let reqBody = req.body.url;
  const bodyRegex = /https:\/\/(www.)?|http:\/\/(www.)?/g;
  if (!bodyRegex.test(reqBody)) {
    res.json({
      error: "invalid url"
    });
  } else {
    newURL.find({original_url: reqBody}, (err, docs) => {
      if (err) return console.log(err);
    }).then(foundAnyURLs => {
      if (!foundAnyURLs.length) {
        let randNum = parseInt(Math.random() * 999999);
        new newURL({
          original_url: reqBody,
          short_url: randNum
        }).save((err, data) => {
          if (err) return console.log(err);
        });
        res.json({
          original_url: reqBody,
          short_url: randNum
        });
      } else {
        res.json({
          original_url: foundAnyURLs[0].original_url,
          short_url: foundAnyURLs[0].short_url
        });
      }
    });
  }
});


app.get('/api/shorturl/:shorturl', function (req, res) {
/*
Inputs:
  An integer value that corresponds to a previuosly saved URL

Outputs:
  Redirects to the URL that corresponds to the integer value that was inputted into the URL
*/
  const shortURLParams = Number(req.params.shorturl);
  newURL.find({short_url: shortURLParams}, (err, doc) => {
    if (err) return console.log(err);
  }).then(urlFound => {
    const redirectURL = urlFound;
    res.redirect(redirectURL[0].original_url)
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
