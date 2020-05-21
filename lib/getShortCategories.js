const _uniqBy = require('lodash.uniqby');

module.exports = (taxonomies) => {
  const sc = _uniqBy(
    taxonomies.map(c => c.name.split(' / ')[0]),
  );
  return sc.map(c => ({
    shortName: c,
    shortPrefix: c.toLowerCase().replace(/ /g, '-').replace('-(it)', ''),
  })).sort((a, b) => {
    // Sort alphabetically by shortName
    if (a.shortName < b.shortName) return -1;
    if (a.shortName > b.shortName) return 1;
    return 0;
  });
};
