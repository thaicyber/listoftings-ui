function handleError(res, err) {
  console.trace(err.message);
  res.status(500).send({ response: err.message });
}

function handleResponse(req, res, es_res, page, app) {
  res.results = es_res.hits.hits.map(hit => hit._source);
  res.totalResults = es_res.hits.total;

  const mergedQuery = Object.assign(
    {},
    req.query,
    req.params,
    { totalResults: es_res.hits.total },
  ); // Ensure server params and client query are available

  return (req.query.ajax) // If called as a fetch it will have ?ajax=1 otherwise server render with page template
    ? res.status(200).send({ results: res.results, totalResults: res.totalResults }) // Client fetch request
    : app.render(req, res, page, mergedQuery); // Server side render
}

module.exports = {
  handleError,
  handleResponse,
};
