const express = require('express');
const { handleError } = require('../../responseHandlers');
const { queryElasticSearch, elasticSearchClient } = require('../../elasticSearch');
const { DEFAULT_REGION } = require('../../../constants/regions');

const getTotalResultsRoute = express.Router();
const _source = [''];

function getQuery(req) {
  const hasDefaultRegion = (req.params.region === DEFAULT_REGION || !req.params.region);
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

/* Search form - get all taxonomies */

getTotalResultsRoute.get('/get-total-results/:slug/:region?', (req, res) => {
  elasticSearchClient.count({
    index: 'listoftingsherokuappcom-1',
    type: 'post',
    body: {
      'query': { 'bool': { 'must': getQuery(req) } },
    },
  }).then(
    es_res => res.status(200).send({
      totalResults: es_res.count,
    }),
    err => handleError(res, err),
  );
});

module.exports = getTotalResultsRoute;
