/* global window document fetch */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import ReactResponsiveSelect from 'react-responsive-select';
import Cookies from 'universal-cookie';
import AutoSuggestContainer from '../components/AutoSuggestContainer';
import { REGION_OPTIONS } from '../constants/regions';
import CATEGORIES from '../constants/categories';

import '../lib/polyfills';

const sendGoogleAnalyticsEvent = ({ event_action, event_label }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'SearchForm', {
      'event_category': 'Search',
      'event_action': event_action,
      'event_label': JSON.stringify(event_label),
    });
  }
};

const sanitiseInputValue = str => str.replace(/\//g, '-').replace(/ /g, '-');
const getBackupInputValue = inputValue => (inputValue !== '' ? sanitiseInputValue(inputValue) : undefined);

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: CATEGORIES,
      autoSuggestValue: {},
      autoSuggestSlug: undefined, // Although a string, server expects 'undefined' when empty
      inputValue: '',
      region: props.region,
      isLoading: false,
    };
  }

  componentDidMount() {
    // document.querySelector('.rrs').addEventListener('click', e => e.target.scrollIntoView({ behavior: 'smooth' }));
  }

  setRegion(newValue) {
    /* Store prefered region */
    const cookies = new Cookies();
    cookies.set('preferredRegion', newValue.value, { path: '/' });
    this.setState({ region: newValue.value });

    sendGoogleAnalyticsEvent({
      'event_action': 'setRegion',
      'event_label': `{ region: ${newValue.value} }`,
    });
  }

  getSearchButton() {
    const { totalResults, isLoading } = this.state;
    if (isLoading) return <div className="spinner" />;
    if (totalResults !== undefined) {
      return <span className="content--fade-in content--fade-in--fast">See {totalResults} lawyer{totalResults === 1 ? '' : 's'}</span>;
    }
    return <span>Search</span>;
  }

  fetchTotalResults(slug, region) {
    this.setState({ isLoading: true });

    fetch(`/get-total-results/${slug}/${region}`)
      .then(results => results.json())
      .then((res) => {
        sendGoogleAnalyticsEvent({
          'event_action': 'selectionChangedReporter',
          'event_label': `{ autoSuggestValue: ${slug}, region: ${region}, totalResults: ${res.totalResults} }`,
        });
        this.setState({ totalResults: res.totalResults, isLoading: false });
      });
  }

  handleRegionChange(newValue) {
    const { autoSuggestSlug, inputValue } = this.state;
    this.setRegion(newValue);

    this.fetchTotalResults(
      autoSuggestSlug || getBackupInputValue(inputValue),
      newValue.value,
    );
  }

  handleAutoSuggestChange(newValue) {
    const { categories, region } = this.state;
    const foundCategory = categories.filter(v => v.name === newValue)[0] || {};
    const foundSlug = foundCategory.slug || undefined;
    this.setState({
      inputValue: newValue,
      autoSuggestValue: foundCategory,
      autoSuggestSlug: foundSlug,
    });

    this.fetchTotalResults(
      foundSlug || getBackupInputValue(newValue),
      region,
    );
  }

  handleAutoSuggestSelection(suggestion) {
    const { region } = this.state;
    this.setState({ autoSuggestSlug: suggestion.slug });

    this.fetchTotalResults(
      suggestion.slug,
      region,
    );
  }

  handleSubmit(e) {
    const { region, categories, autoSuggestValue, inputValue } = this.state;
    const found = categories.filter(v => v.name === autoSuggestValue.name)[0] || {};
    e.preventDefault();

    this.setState({ isLoading: true });

    sendGoogleAnalyticsEvent({
      'event_action': 'handleSubmit',
      'event_label': `{ autoSuggestValue: ${autoSuggestValue.name}, region: ${region} }`,
    });

    if (autoSuggestValue.name && found.slug) {
      Router.push(
        `/lawyer-specialty?slug=${found.slug}&region=${region}&page=1&ajax=1`,
        `/lawyer-specialty/${found.slug}/${region}/1`,
      );
    } else if (inputValue === '') {
      Router.push(
        `/lawyers?region=${region}&page=1&ajax=1`,
        `/lawyers/${region}/1`,
      );
    }
  }

  toggleButtonDisabled() {
    const { autoSuggestSlug, inputValue } = this.state;
    let isDisabled;
    // autoSuggestSlug is only filled when the inputValue matches a category
    // Empty inputValue sends you generic lawyers page
    const isEmptySearch = (inputValue === '' && autoSuggestSlug === undefined);
    // a match must be found to go to the lawyer-specialty page so this should return true
    const isIncompleteSearch = (inputValue !== '' && autoSuggestSlug === undefined);
    const hasMatchedSearch = (!isEmptySearch && inputValue === autoSuggestSlug);

    if (isEmptySearch) {
      isDisabled = false;
    } else if (isIncompleteSearch) {
      isDisabled = true;
    } else if (hasMatchedSearch) {
      isDisabled = false;
    }
    return isDisabled;
  }

  render() {
    const { categories, region } = this.state;
    const searchDisabled = this.toggleButtonDisabled();
    return (
      <div>
        {region &&
        <form
          className="search-form content--fade-in"
          ref={(r) => { this.form = r; }}
          onSubmit={e => this.handleSubmit(e)}
        >
          <AutoSuggestContainer
            categories={categories}
            changeReporter={(newValue) => { this.handleAutoSuggestChange(newValue); }}
            selectionChangedReporter={(suggestion) => { this.handleAutoSuggestSelection(suggestion); }}
          />
          <ReactResponsiveSelect
            name="region"
            selectedValue={region}
            prefix="Region: "
            onSubmit={() => { this.form.submit(); }}
            options={REGION_OPTIONS}
            onChange={(newValue) => { this.handleRegionChange(newValue); }}
          />
          <button disabled={searchDisabled} type="submit">
            {this.getSearchButton()}
          </button>
        </form>
        }
      </div>
    );
  }
}

Index.propTypes = {
  region: PropTypes.string.isRequired,
};
