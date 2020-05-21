const express = require('express');

const indexRoute = express.Router();

module.exports = app => (
  indexRoute.get('/search-lawyers-by-speciality', (req, res) => (
    (req.query.ajax) // If called as a fetch it will have ?ajax=1 otherwise server render with page template
      ? res.status(200).send({}) // Client fetch request
      : app.render(req, res, '/search-lawyers-by-speciality', {}) // Server side render
  ))
);
