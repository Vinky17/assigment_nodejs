const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const session = require('express-session');

app.use(session({
  secret: 'vinky',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.set('view engine', 'ejs');
app.set('views', './app');
app.use(express.static('./public'));

// use route
const route = require('./app/routes/r_index');
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})