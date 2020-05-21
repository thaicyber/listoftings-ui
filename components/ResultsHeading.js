import React from 'react';
import PropTypes from 'prop-types';
import { RESULTS_PER_PAGE } from '../constants/config';

const ResultsHeading = ({ currentPage, totalResults }) => (
  <div className="results-heading">
    <p>Page {currentPage} of {Math.ceil(totalResults / RESULTS_PER_PAGE)}</p>
    <p>Total results {totalResults}</p>
  </div>
);

ResultsHeading.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default ResultsHeading;
