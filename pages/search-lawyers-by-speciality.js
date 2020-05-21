/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _uniqBy from 'lodash.uniqby';
import GlobalLayout from '../components/GlobalLayout';
import SearchForm from '../components/SearchForm';
import HomeHeroLinks from '../components/HomeHeroLinks';
import getPreferredRegion from '../lib/getPreferredRegion';
import CATEGORIES from '../constants/categories';

import '../lib/polyfills';

export default class Index extends Component {
  static async getInitialProps({ req, res, asPath }) {
    const preferredRegion = getPreferredRegion(req);
    return res
      ? {
        canonicalUrl: asPath,
        preferredRegion,
      }
      : fetch('/search-lawyers-by-speciality?ajax=1')
        .then(response => response.json())
        .then(() => ({
          canonicalUrl: asPath,
          preferredRegion,
        }));
  }

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      region: undefined,
    };
  }

  componentWillMount() {
    const getShortCategories = () => {
      const sc = _uniqBy(
        CATEGORIES.map(c => c.name.split(' / ')[0]),
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

    /* Return unique taxonomies */
    this.setState({
      categories: CATEGORIES,
      shortCategories: getShortCategories(),
    });
  }

  render() {
    const { preferredRegion, canonicalUrl } = this.props;
    const { shortCategories } = this.state;
    return (
      <GlobalLayout
        title="Find a lawyer in New Zealand - LawList"
        region={preferredRegion}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <HomeHeroLinks selectedSection="search" />

        {preferredRegion &&
        <SearchForm region={preferredRegion} />
        }

        <footer className="footer">
          <div className="content-section">
            <h2>Categories</h2>
            <ul className="specialities">
              {shortCategories.map(shortCategory => (
                <li
                  className="specialities__item"
                  key={shortCategory.shortPrefix}
                >
                  <a
                    className="specialities__link"
                    href={`/${shortCategory.shortPrefix}-lawyers-new-zealand/1`}
                  >
                    <span className="specialities__link__text">{shortCategory.shortName}</span>
                    <span className="specialities__link__link">+SEARCH LAWYERS</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>

      </GlobalLayout>
    );
  }
}

Index.defaultProps = {
  canonicalUrl: '',
};

Index.propTypes = {
  canonicalUrl: PropTypes.string,
  preferredRegion: PropTypes.string.isRequired,
};
