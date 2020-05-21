/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import titleCase from 'title-case';
import get from 'get-or-else';
import GlobalLayout from '../components/GlobalLayout';
import SearchForm from '../components/SearchForm';
import Thumb from '../components/Thumb';
import Pagination from '../components/Pagination';
import ResultsHeading from '../components/ResultsHeading';
import getPreferredRegion from '../lib/getPreferredRegion';
import resultsPropTypes from '../propTypes/results';

import '../lib/polyfills';

export default class PrefixLawyersNZ extends Component {
  static async getInitialProps({ req, res, asPath }) {
    const preferredRegion = getPreferredRegion(req);
    const lawPrefix = get([req, 'params.prefix']) || asPath.split('-')[0];
    const currentPage = get([req, 'params.page']) || asPath.substr(asPath.lastIndexOf('/') + 1);

    return res
      ? {
        canonicalUrl: asPath,
        preferredRegion,
        prefix: lawPrefix,
        results: res.results,
        totalResults: res.totalResults,
        currentPage: Number(currentPage),
      }
      : fetch(`${lawPrefix}-lawyers-new-zealand?ajax=1`)
        .then(response => response.json())
        .then(({ results, totalResults }) => ({
          canonicalUrl: asPath,
          preferredRegion,
          prefix: lawPrefix,
          results,
          totalResults,
          currentPage: Number(currentPage),
        }));
  }

  render() {
    const { results, prefix, preferredRegion, canonicalUrl, totalResults, currentPage } = this.props;
    return (
      <GlobalLayout
        title={`${titleCase(prefix)} Lawyers New Zealand`}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <div className="content--fade-in">
          <h1>{titleCase(prefix)} Lawyers New Zealand</h1>

          {totalResults > 0 &&
          <ResultsHeading
            currentPage={currentPage}
            totalResults={totalResults}
          />
          }

          <ul className="search-results">
            {results && results.map(r => (
              <li key={`nav_${r.post_name}`}>
                <Thumb
                  url={{
                    href: `/lawyer/?slug=${r.post_name}&ajax=1`,
                    as: `/lawyer/${r.post_name}/`,
                  }}
                  taxonomies={r.taxonomies}
                  post_title={r.post_title}
                  featured_image_url={r.featured_image_url}
                  region={r.region}
                />
              </li>
            ))}
          </ul>

          {results.length === 0 && preferredRegion &&
          <div>
            <p>Your search returned 0 results, please try again</p>
            <SearchForm region={preferredRegion} />
          </div>
          }
        </div>

        <Pagination
          totalResults={totalResults}
          currentPage={currentPage}
        />

      </GlobalLayout>
    );
  }
}

PrefixLawyersNZ.defaultProps = {
  canonicalUrl: '',
  results: [],
  preferredRegion: undefined,
};

PrefixLawyersNZ.propTypes = {
  canonicalUrl: PropTypes.string,
  results: resultsPropTypes,
  preferredRegion: PropTypes.string,
  prefix: PropTypes.string.isRequired,
  totalResults: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};
