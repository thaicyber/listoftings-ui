const express = require('express');
const { handleResponse, handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');

const lawyerRoute = express.Router();

module.exports = app => (
  lawyerRoute.get('/lawyer/:slug/', (req, res) => {
    queryElasticSearch({
      'bool': {
        'must': { 'match_phrase': { 'post_name': req.params.slug } },
      },
    }).then(
      es_res => handleResponse(req, res, es_res, '/lawyer', app),
      err => handleError(res, err),
    );
  })
);
