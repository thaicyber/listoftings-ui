const express = require('express');

const pitchAProjectRoute = express.Router();

module.exports = (app, csrfProtection) => (
  pitchAProjectRoute.get('/pitch-a-project-for-a-lawyer/', csrfProtection, (req, res) => {
    res.csrfToken = req.csrfToken();
    app.render(req, res, '/pitch-a-project-for-a-lawyer');
  })
);
