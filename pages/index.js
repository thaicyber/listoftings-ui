/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalLayout from '../components/GlobalLayout';
import HomeHeroLinks from '../components/HomeHeroLinks';
import getShortCategories from '../lib/getShortCategories';
import getPreferredRegion from '../lib/getPreferredRegion';
import { REGION_OPTIONS } from '../constants/regions';
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
      : fetch('/?ajax=1')
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
    /* Return unique taxonomies */
    this.setState({
      categories: CATEGORIES,
      shortCategories: getShortCategories(CATEGORIES),
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
        <HomeHeroLinks selectedSection="none" />

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

          <div className="content-section">
            <p>For later SEO consideration</p>
            <h2>Popular searches</h2>
            <ul className="list-inline">
              {REGION_OPTIONS.filter((r, i) => i !== 0).map(r => (
                <li key={r.value}>
                  <a href={`/lawyers/${r.value}/1`}>Lawyers in {r.text}</a>
                </li>
              ))}
            </ul>
            <br />
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
