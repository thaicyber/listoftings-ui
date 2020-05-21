const PropTypes = require('prop-types');

module.exports = (
  PropTypes.arrayOf(
    PropTypes.shape({
      locality: PropTypes.shape({
        lat: PropTypes.string,
        lon: PropTypes.string,
      }),
      taxonomies: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          slug: PropTypes.string,
        }),
      ),
      sub_heading: PropTypes.string,
      featured_image_url: PropTypes.string,
      background: PropTypes.string,
      experience: PropTypes.string,
      phone_number: PropTypes.string,
      mobile_number: PropTypes.string,
      fax_number: PropTypes.string,
      email_address: PropTypes.string,
      postal_address: PropTypes.string,
      post_name: PropTypes.string,
      post_title: PropTypes.string,
    }).isRequired,
  )
);
