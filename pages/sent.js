import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalLayout from '../components/GlobalLayout';

export default class Send extends Component {
  static async getInitialProps({ asPath }) {
    return { canonicalUrl: asPath };
  }

  render() {
    return (
      <GlobalLayout
        title={'Pitch a project for a lawyer'}
        canonicalUrl={this.props.canonicalUrl}
        description="A description"
      >
        <h1>You&rsquo;ve pitched</h1>
        <p>We&rsquo;ll find some lawyers that match your project and be in touch soon.</p>
        <img alt="" width="100" src="https://m.popkey.co/987552/NGLb3.gif" />
      </GlobalLayout>
    );
  }
}

Send.propTypes = {
  canonicalUrl: PropTypes.string.isRequired,
};
