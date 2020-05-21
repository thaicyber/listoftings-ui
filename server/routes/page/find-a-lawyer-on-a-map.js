const express = require('express');
const { handleResponse, handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');

const lawyersRoute = express.Router();

module.exports = app => (
  lawyersRoute.get('/find-a-lawyer-on-a-map/', (req, res) => {
    queryElasticSearch({
      'bool': { 'must': { 'match_phrase': { 'post_type': 'profile' } } },
    }).then(
      es_res => handleResponse(req, res, es_res, '/find-a-lawyer-on-a-map', app),
      err => handleError(res, err),
    );
  })
);
