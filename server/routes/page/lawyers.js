const express = require('express');
const { handleResponse, handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');
const { DEFAULT_REGION } = require('../../../constants/regions');
const { RESULTS_PER_PAGE } = require('../../../constants/config');

const lawyersRoute = express.Router();

module.exports = app => (

  lawyersRoute.get('/lawyers/:region/:page?', (req, res) => {
    const from = req.params.page ? (req.params.page - 1) * RESULTS_PER_PAGE : 0;

    if (req.cookies && req.cookies.preferredRegion) {
      req.cookies.preferredRegion = req.params.region;
    }

    const _source = ['post_name', 'post_title', 'featured_image_url', 'region', 'taxonomies'];

    const query = (req.params.region === DEFAULT_REGION)
      ? { 'match_phrase': { 'post_type': 'profile' } }
      : [
        { 'match_phrase': { 'post_type': 'profile' } },
        { 'match_phrase': { 'region': req.params.region } },
      ];

    queryElasticSearch(
      { 'bool': { 'must': query } },
      _source,
      from,
    ).then(
      es_res => handleResponse(req, res, es_res, '/lawyers', app),
      err => handleError(res, err),
    );
  })
);
