/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'get-or-else';
import GlobalLayout from '../components/GlobalLayout';
import SearchForm from '../components/SearchForm';
import Thumb from '../components/Thumb';
import Pagination from '../components/Pagination';
import ResultsHeading from '../components/ResultsHeading';
import getPreferredRegion from '../lib/getPreferredRegion';
import resultsPropTypes from '../propTypes/results';

import '../lib/polyfills';

export default class Lawyers extends Component {
  static async getInitialProps({ req, res, asPath }) {
    const preferredRegion = getPreferredRegion(req);
    const currentPage = get([req, 'params.page']) || asPath.substr(asPath.lastIndexOf('/') + 1);

    return res
      ? {
        canonicalUrl: asPath,
        currentPage: Number(currentPage),
        preferredRegion,
        results: res.results,
        totalResults: res.totalResults,
      }
      : fetch(`/lawyers/${preferredRegion}/${currentPage}?ajax=1`)
        .then(response => response.json())
        .then(({ results, totalResults }) => ({
          canonicalUrl: asPath,
          currentPage: Number(currentPage),
          preferredRegion,
          results,
          totalResults,
        }));
  }

  render() {
    const { results, preferredRegion, canonicalUrl, totalResults, currentPage } = this.props;

    return (
      <GlobalLayout
        title={`${preferredRegion.replace(/-/g, ' ')} Lawyers`}
        region={preferredRegion}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <div className="content--fade-in">
          <h1>{`${preferredRegion.replace(/-/g, ' ')} Lawyers`}</h1>

          {totalResults > 0 &&
          <ResultsHeading
            currentPage={currentPage}
            totalResults={totalResults}
          />
          }

          <ul className="search-results">
            {results && results.map(r => (
              <li key={`result_${r.post_name}`}>
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
            {preferredRegion &&
            <SearchForm region={preferredRegion} />
            }
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

Lawyers.defaultProps = {
  results: [],
  preferredRegion: undefined,
  canonicalUrl: '',
};

Lawyers.propTypes = {
  results: resultsPropTypes,
  preferredRegion: PropTypes.string,
  canonicalUrl: PropTypes.string,
  totalResults: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};
