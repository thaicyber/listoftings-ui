import React from 'react';
import PropTypes from 'prop-types';
import { RESULTS_PER_PAGE } from '../constants/config';

const Pagination = ({ currentPage, totalResults }) => {
  const hidePagination = (currentPage === 1 && totalResults < RESULTS_PER_PAGE);
  const prevPage = (currentPage > 1)
    ? currentPage - 1
    : 1;
  const nextPage = (totalResults > (currentPage * RESULTS_PER_PAGE))
    ? currentPage + 1
    : currentPage;

  if (hidePagination) {
    return null;
  }
  return (
    <p style={{ margin: '3rem 0' }}>
      {currentPage !== 1 && <a href={prevPage}>Previous page</a>}
      {currentPage === 1 && <span>Previous page</span>}
      <span> | </span>
      {(totalResults > (currentPage * RESULTS_PER_PAGE)) && <a href={nextPage}>Next page</a>}
      {(totalResults < (currentPage * RESULTS_PER_PAGE)) && <span>Next page</span>}
    </p>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default Pagination;
