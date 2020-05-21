const express = require('express');

const indexRoute = express.Router();

module.exports = app => (
  indexRoute.get('/', (req, res) => (
    (req.query.ajax) // If called as a fetch it will have ?ajax=1 otherwise server render with page template
      ? res.status(200).send({}) // Client fetch request
      : app.render(req, res, '/index', {}) // Server side render
  ))
);
