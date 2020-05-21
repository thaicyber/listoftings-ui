const elasticSearch = require('elasticsearch');
const { RESULTS_PER_PAGE } = require('../constants/config');

const elasticSearchClient = new elasticSearch.Client({
  host: process.env.ES_HOST,
  log: 'debug',
});

function queryElasticSearch(query, _source, from) {
  return elasticSearchClient.search({
    index: 'listoftingsherokuappcom-1',
    type: 'post',
    body: {
      '_source': _source || [
        'address',
        'featured_image_url',
        'postal_address',
        'street_address',
        'region',
        'locality',
        'background',
        'experience',
        'endorsements',
        'phone_number',
        'mobile_number',
        'fax_number',
        'post_title',
        'post_name',
        'sub_heading',
        'email_address',
        'post_type',
        'taxonomies',
      ],
      'from': from,
      'size': RESULTS_PER_PAGE,
      query,
    },
  });
}

module.exports = {
  queryElasticSearch,
  elasticSearchClient,
};
