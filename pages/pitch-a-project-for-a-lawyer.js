/* global fetch Headers */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import ReactResponsiveSelect from 'react-responsive-select';
import GlobalLayout from '../components/GlobalLayout';
import HomeHeroLinks from '../components/HomeHeroLinks';
import getShortCategories from '../lib/getShortCategories';
import CATEGORIES from '../constants/categories';

import '../lib/polyfills';

const caretIcon = (
  <svg className="caret-icon" x="0px" y="0px" width="11.848px" height="6.338px" viewBox="351.584 2118.292 11.848 6.338">
    <g><path d="M363.311,2118.414c-0.164-0.163-0.429-0.163-0.592,0l-5.205,5.216l-5.215-5.216c-0.163-0.163-0.429-0.163-0.592,0s-0.163,0.429,0,0.592l5.501,5.501c0.082,0.082,0.184,0.123,0.296,0.123c0.103,0,0.215-0.041,0.296-0.123l5.501-5.501C363.474,2118.843,363.474,2118.577,363.311,2118.414L363.311,2118.414z" /></g>
  </svg>
);

const multiSelectOptionMarkup = text => (
  <div>
    <span className="checkbox">
      <svg className="checkbox-icon" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 488.878 488.878">
        <g><polygon points="143.294,340.058 50.837,247.602 0,298.439 122.009,420.447 122.149,420.306 144.423,442.58 488.878,98.123 437.055,46.298 " /></g>
      </svg>
    </span>
    <span> {text}</span>
  </div>
);

export default class PitchAProject extends Component {
  static async getInitialProps({ req, asPath }) {
    if (!req) Router.replace('/');
    return {
      canonicalUrl: asPath,
      CSRF_TOKEN: req ? req.csrfToken() : '',
    };
  }

  state = {
    isLoading: false,
  }

  submitHandler(e) {
    e.preventDefault();
    const { CSRF_TOKEN } = this.props;

    this.setState({ isLoading: true });

    const formData = JSON.stringify({ ...this.state });

    fetch('/send', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-xsrf-token': CSRF_TOKEN,
      }),
      body: formData,
    }).then((response) => {
      Router.push({
        pathname: '/sent',
        query: { result: (response.status === '200' ? 1 : 0) },
      });
    }).catch(err => console.log('ERROR :(', err));
  }

  render() {
    const { canonicalUrl } = this.props;
    const { isLoading } = this.state;
    const firstInputProps = {  };
    const shortCategories = getShortCategories(CATEGORIES);

    return (
      <GlobalLayout
        title={'Pitch a project for a lawyer'}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <HomeHeroLinks selectedSection="pitch" />

        <div className="content--fade-in">
          <h2 style={{ marginTop: '3rem' }}>Project details</h2>

          <form
            className="pitch-form"
            onSubmit={(e) => { this.submitHandler(e); }}
          >

            <ul className="pitch-form__list">
              <li className="pitch-form__item">
                <label htmlFor="name">Full name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => { this.setState({ name: e.target.value }); }}
                  {...firstInputProps}
                />
              </li>
              <li className="pitch-form__item">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={(e) => { this.setState({ email: e.target.value }); }}
                />
              </li>
              <li className="pitch-form__item">
                <label htmlFor="phone">Phone</label>
                <br />
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  onChange={(e) => { this.setState({ phone: e.target.value }); }}
                />
              </li>
              <li className="pitch-form__item">
                <label htmlFor="projectTitle">Title of project</label>
                <br />
                <input
                  type="text"
                  name="projectTitle"
                  id="projectTitle"
                  onChange={(e) => { this.setState({ projectTitle: e.target.value }); }}
                />
              </li>
              <li className="pitch-form__item">
                <label htmlFor="areasOfLaw">Areas of law</label>
                <br />
                <ReactResponsiveSelect
                  multiselect
                  name="areasOfLaw"
                  options={[
                    { value: 'Not sure', text: 'Not sure', markup: multiSelectOptionMarkup('Not sure') },
                    ...shortCategories.map(v => ({
                      value: v.shortName,
                      text: v.shortName,
                      markup: multiSelectOptionMarkup(v.shortName),
                    }),
                    ),
                  ]}
                  caretIcon={caretIcon}
                  prefix=""
                  onChange={(newValue) => {
                    this.setState({
                      areasOfLaw: newValue.options.map(v => v.value).join(', '),
                    });
                  }}
                />
              </li>
              <li className="pitch-form__item">
                <p>Pricing</p>
                <br />
                <label htmlFor="pricing_fixed">
                  <input
                    onChange={(e) => { this.setState({ pricing: e.target.value }); }}
                    type="radio"
                    id="pricing_fixed"
                    name="pricing"
                    value="fixed"
                  />
                  Fixed
                </label>
                <label htmlFor="pricing_hourly">
                  <input
                    onChange={(e) => { this.setState({ pricing: e.target.value }); }}
                    type="radio"
                    id="pricing_hourly"
                    name="pricing"
                    value="hourly"
                  />
                  Hourly
                </label>
                <label htmlFor="pricing_optional">
                  <input
                    onChange={(e) => { this.setState({ pricing: e.target.value }); }}
                    type="radio"
                    id="pricing_optional"
                    name="pricing"
                    value="optional"
                  />
                  Optional
                </label>
              </li>

              <li className="pitch-form__item">
                <label htmlFor="budget">Budget</label>
                <br />
                <input
                  type="text"
                  name="budget"
                  id="budget"
                  onChange={(e) => { this.setState({ budget: e.target.value }); }}
                />
              </li>

              <li className="pitch-form__item">
                <p>Timeframe</p>
                <br />
                <label htmlFor="timeframe_urgent">
                  <input
                    onChange={(e) => { this.setState({ timeframe: e.target.value }); }}
                    type="radio"
                    id="timeframe_optional"
                    name="timeframe"
                    value="urgent"
                  />
                  Urgent
                </label>
                <label htmlFor="timeframe_moderate">
                  <input
                    onChange={(e) => { this.setState({ timeframe: e.target.value }); }}
                    type="radio"
                    id="timeframe_moderate"
                    name="timeframe"
                    value="moderate"
                  />
                  Moderate
                </label>
                <label htmlFor="timeframe_flexible">
                  <input
                    onChange={(e) => { this.setState({ timeframe: e.target.value }); }}
                    type="radio"
                    id="timeframe_flexible"
                    name="timeframe"
                    value="hourly"
                  />
                  Hourly
                </label>
              </li>

              <li className="pitch-form__item">
                <label htmlFor="additionalInfo">Additional info</label>
                <br />
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  onChange={(e) => { this.setState({ additionalInfo: e.target.value }); }}
                />
              </li>
              <li className="pitch-form__item">
                <button
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading && <div className="spinner" />}
                  {!isLoading && <span>Submit</span>}
                </button>
              </li>
            </ul>
          </form>
        </div>

      </GlobalLayout>
    );
  }
}

PitchAProject.defaultProps = {
  canonicalUrl: '',
};

PitchAProject.propTypes = {
  canonicalUrl: PropTypes.string,
  CSRF_TOKEN: PropTypes.string.isRequired,
};
