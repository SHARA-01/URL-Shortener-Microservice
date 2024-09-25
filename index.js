require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let short_url = null;

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;
  const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    const urlCode = url
      .replace(/https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    short_url = url;
    res.json({ original_url: url, short_url: urlCode });
  }
});

app.get('/api/shorturl/:urlCode', function (req, res) {
  const urlCode = req.params.urlCode;
  res.redirect(`${short_url}`);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
