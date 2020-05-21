/* global fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalLayout from '../components/GlobalLayout';
import SearchForm from '../components/SearchForm';
import getPreferredRegion from '../lib/getPreferredRegion';

import '../lib/polyfills';

export default class Error extends Component {
  static async getInitialProps({ req, res }) {
    const preferredRegion = getPreferredRegion(req);

    return res
      ? { preferredRegion }
      : fetch('/?ajax=1')
        .then(response => response.json())
        .then(() => ({ preferredRegion }));
  }

  render() {
    const { preferredRegion } = this.props;
    return (
      <GlobalLayout
        title="Error page"
        region={preferredRegion}
      >

        <h1>Opps! Something went wrong.</h1>
        <p>Please try searching again</p>

        {preferredRegion &&
        <SearchForm region={preferredRegion} />
        }

      </GlobalLayout>
    );
  }
}

Error.propTypes = {
  preferredRegion: PropTypes.string.isRequired,
};
