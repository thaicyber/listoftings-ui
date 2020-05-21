/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'get-or-else';
import GlobalLayout from '../components/GlobalLayout';
import SearchForm from '../components/SearchForm';
import Thumb from '../components/Thumb';
import Pagination from '../components/Pagination';
import ResultsHeading from '../components/ResultsHeading';
import CATEGORIES from '../constants/categories';
import resultsPropTypes from '../propTypes/results';

import '../lib/polyfills';

export default class LawyersSpecialty extends Component {
  static async getInitialProps({ req, res, query, asPath }) {
    const currentPage = get([req, 'params.page']) || asPath.substr(asPath.lastIndexOf('/') + 1);
    return res
      ? {
        canonicalUrl: asPath,
        region: query.region,
        results: res.results,
        totalResults: res.totalResults,
        currentPage: Number(currentPage),
        slug: query.slug,
      }
      : fetch(`/lawyer-specialty/${query.slug}/${query.region}?ajax=1`)
        .then(results => results.json())
        .then(response => ({
          canonicalUrl: asPath,
          region: query.region,
          totalResults: response.totalResults,
          results: response.results,
          currentPage: Number(currentPage),
          slug: query.slug,
        }));
  }

  render() {
    const { results, slug, region, canonicalUrl, totalResults, currentPage } = this.props;
    const searchCategory = CATEGORIES.filter(v => v.slug === slug);
    const category = searchCategory.length ? searchCategory[0].name : '';
    if (category !== '') {
      return (
        <GlobalLayout
          title={`${region.replace(/-/g, ' ')} Lawyers specializing in ${category}`}
          region={region}
          canonicalUrl={canonicalUrl}
          description="A description"
        >
          <div className="content--fade-in">
            <h1>{`${region.replace(/-/g, ' ')} Lawyers specializing in ${category}`}</h1>

            {totalResults > 0 &&
            <ResultsHeading
              currentPage={currentPage}
              totalResults={totalResults}
            />
            }

            {results &&
            <ul className="search-results">
              {results.map(r => (
                <li key={`nav_${r.post_name}`} className="thumbs__item">
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
            }
          </div>

          {totalResults === 0 &&
          <div>
            <div className="content--fade-in">
              <p>Your search returned 0 results, please try again</p>
              {region &&
              <SearchForm region={region} />
              }
            </div>
          </div>
          }

          <Pagination
            totalResults={totalResults}
            currentPage={currentPage}
          />

        </GlobalLayout>
      );
    }
    return (
      <GlobalLayout
        title={'No results found'}
        region={region}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <div>
          <div className="content--fade-in">
            <h1>Lawyer specialty search</h1>
            <p>Your search returned 0 results, please try again</p>
            {region &&
            <SearchForm region={region} />
            }
          </div>
        </div>
      </GlobalLayout>
    );
  }
}

LawyersSpecialty.defaultProps = {
  results: [],
  canonicalUrl: '',
};

LawyersSpecialty.propTypes = {
  results: resultsPropTypes,
  slug: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  canonicalUrl: PropTypes.string,
  totalResults: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};
