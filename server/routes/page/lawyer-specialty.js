const express = require('express');
const { handleResponse, handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');
const { DEFAULT_REGION } = require('../../../constants/regions');
const { RESULTS_PER_PAGE } = require('../../../constants/config');

const lawyerSpecialityRoute = express.Router();

function getQuery(req) {
  const hasDefaultRegion = req.params.region === DEFAULT_REGION;
  const hasTaxonomy = req.params.slug !== 'undefined';

  if (hasDefaultRegion) {
    if (hasTaxonomy) {
      return { 'match_phrase': { 'taxonomies.slug.keyword': req.params.slug } };
    }
    if (!hasTaxonomy) {
      return { 'match_all': {} };
    }
  }

  if (!hasDefaultRegion) {
    if (hasTaxonomy) {
      return [
        { 'match_phrase': { 'taxonomies.slug.keyword': req.params.slug } },
        { 'match_phrase': { 'region': req.params.region } },
      ];
    }
    if (!hasTaxonomy) {
      return { 'match_phrase': { 'region': req.params.region } };
    }
  }

  return false;
}

module.exports = app => (
  lawyerSpecialityRoute.get('/lawyer-specialty/:slug/:region/:page?', (req, res) => {
    const from = req.params.page ? (req.params.page - 1) * RESULTS_PER_PAGE : 0;

    const query = getQuery(req);
    const _source = ['post_name', 'post_title', 'featured_image_url', 'region', 'taxonomies'];

    if (query) {
      queryElasticSearch(
        { 'bool': { 'must': query } },
        _source,
        from,
      ).then(
        es_res => handleResponse(req, res, es_res, '/lawyer-specialty', app),
        err => handleError(res, err),
      );
    }
  })
);
