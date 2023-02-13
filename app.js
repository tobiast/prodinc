const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// få ekspress til å dele en public-folder til CSS, bilder osv
app.use(express.static(__dirname + '/public'));

// bruk pug som template-motor (Skrive HTML)
app.set('view engine', 'pug');

// side som håndterer item
var items = require('./items.js');
app.use('/items', items);

// Side som brukes til å svare på ping: En slags pulssjekk
app.use('/ping', function (req, res) {
    res.render("message", { title: 'PONG!', message: 'pong'})
});

// fang alle URL-er som ikke er mappet opp. Svare med en fin feilside
app.get('*', function(req, res) {
  res.render("error", { title: 'Siden finnes ikke!', message: 'Du har forsøkt å gå til en side som ikke finnes.'})
});

// Side som brukes til å svare på ping: En slags pulssjekk
app.use('/', function (req, res) {
  res.render("frontpage")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
