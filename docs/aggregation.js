const express = require('express');
const { REGION_OPTIONS } = require('../../../constants/regions');
const { handleError } = require('../../responseHandlers');
const { elasticSearchClient } = require('../../elasticSearch');

const aggregationRoute = express.Router();

aggregationRoute.get('/aggregation', (req, res) => {
  const aggs = {};

  REGION_OPTIONS.forEach((r) => {
    aggs[r.value] = {
      'filter': { 'term': { 'region.keyword': r.value } },
      'aggs': {
        'slugs': {
          'terms': { 'field': 'taxonomies.slug.keyword' },
        },
      },
    };
  });

  elasticSearchClient.search({
    index: 'listoftingsherokuappcom-1',
    type: 'post',
    body: {
      'size': 0,
      'aggs': aggs,
    },
  }).then(
    es_res => res.status(200).send({ es_res }),
    err => handleError(res, err),
  );
});

module.exports = aggregationRoute;
