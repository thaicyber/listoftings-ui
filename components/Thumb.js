import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import getShortCategories from '../lib/getShortCategories';
import getWordpressImage, { IMAGE_TYPES } from '../lib/getWordpressImage';

const Thumb = ({ url, post_title, featured_image_url, region, taxonomies }) => (
  <Link prefetch href={url.href} as={url.as}>
    <a className="thumb">
      <div className="thumb__item">
        <img className="thumb__item__img" src={getWordpressImage(featured_image_url, IMAGE_TYPES.THUMB)} alt="" />
      </div>
      <div className="thumb__item__description">
        <h4 className="thumb__item__heading">{post_title}</h4>
        <div>Region: {region.replace(/-/g, ' ')}</div>
        <div>Specialities: {getShortCategories(taxonomies).map(t => t.shortName).join(', ')}</div>
      </div>
    </a>
  </Link>
);

Thumb.propTypes = {
  url: PropTypes.shape({
    href: PropTypes.string.isRequired,
    as: PropTypes.string.isRequired,
  }).isRequired,
  post_title: PropTypes.string.isRequired,
  featured_image_url: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  taxonomies: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Thumb;
