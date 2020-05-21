const express = require('express');
const _uniqBy = require('lodash.uniqby');
const { handleError } = require('../../responseHandlers');
const { queryElasticSearch } = require('../../elasticSearch');

const taxonomiesRoute = express.Router();

/* Search form - get all taxonomies */
taxonomiesRoute.get('/taxonomies', (req, res) => {
  const _source = ['taxonomies'];

  queryElasticSearch({
    'bool': {
      'must': {
        'match_phrase': { 'post_type': 'profile' },
      },
    },
  },
  _source,
  ).then(
    (es_res) => {
      const allTaxonomies = [
        ...es_res.hits.hits.map(r => r._source.taxonomies),
      ];
      return res.status(200).send(
        _uniqBy(allTaxonomies, 'slug'),
      );
    },
    err => handleError(res, err),
  );
});

module.exports = taxonomiesRoute;
