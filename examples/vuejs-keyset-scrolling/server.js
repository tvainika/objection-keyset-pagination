const express = require('express');

const { Model } = require('objection');
const knex = require('knex')(require('./knexfile')['development']);

Model.knex(knex);

const Prime = require('./models/Prime');

var app = express();

app.use('/primes', async function(req, res) {
  try {
    const primes = await Prime.query()
          .orderBy('id')
          .keysetPage(req.query.cursor);

    return res.json({primes: primes.results, cursor: JSON.stringify(primes.keyset)});
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get("/", (req, res) => {
    return res.sendFile(__dirname + '/webapp/index.html');
});

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'errors-only',
  logLevel: 'trace'
}));

var server = app.listen(process.env.PORT || 8888, function() {
  console.log(`Open with your browser http://localhost:${server.address().port}/`);
});
