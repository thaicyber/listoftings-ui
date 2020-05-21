import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class HomeHeroLinks extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedSection: props.selectedSection };
  }

  render() {
    const { selectedSection } = this.state;
    return (
      <div className="home-hero-links">
        <div className="home-hero-links__box">
          <Link href="/search-lawyers-by-speciality?ajax=1" as="/search-lawyers-by-speciality/">
            <a
              role="button"
              tabIndex="0"
              onClick={() => this.setState({ selectedSection: 'search' })}
            >
              <h2 className="serif">Search<br />lawyers<br />by<br />speciality</h2>
              <span className={`button-circle ${(selectedSection === 'search') ? 'button-circle--open' : ''}`}>
                {'~'}
              </span>
            </a>
          </Link>
        </div>
        
        <div className="home-hero-links__box">
          <a
            role="button"
            tabIndex="0"
            onClick={() => this.setState({ selectedSection: 'pitch' })}
            href="/pitch-a-project-for-a-lawyer/"
          >
            <h2>Pitch<br />a project<br />for a<br />lawyer</h2>
            <span className={`button-circle ${selectedSection === 'pitch' ? 'button-circle--open' : ''}`}>
              {'~'}
            </span>
          </a>
        </div>

        
      </div>
    );
  }
}

HomeHeroLinks.propTypes = {
  selectedSection: PropTypes.string.isRequired,
};
