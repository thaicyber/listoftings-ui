const express = require('express');
const { handleResponse, handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');
const { RESULTS_PER_PAGE } = require('../../../constants/config');

const prefixLawNewZealandRoute = express.Router();
const _source = ['post_name', 'post_title', 'featured_image_url', 'region', 'taxonomies'];

module.exports = app => (
  prefixLawNewZealandRoute.get('/:prefix-lawyers-new-zealand/:page?', (req, res) => {
    const from = req.params.page ? (req.params.page - 1) * RESULTS_PER_PAGE : 0;

    queryElasticSearch(
      { 'prefix': { 'taxonomies.slug.keyword': req.params.prefix } },
      _source,
      from,
    ).then(
      es_res => handleResponse(req, res, es_res, '/prefix-lawyers-new-zealand', app),
      err => handleError(res, err),
    );
  })
);
