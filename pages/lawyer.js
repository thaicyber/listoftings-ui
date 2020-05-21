/* global window fetch */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import GlobalLayout from "../components/GlobalLayout";
import getWordpressImage, { IMAGE_TYPES } from "../lib/getWordpressImage";
import getPreferredRegion from "../lib/getPreferredRegion";
import { DEFAULT_REGION } from "../constants/regions";
import resultsPropTypes from "../propTypes/results";
import { GOOGLE_MAPS_KEY } from "../constants/config";

import "../lib/polyfills";

const sendGoogleAnalyticsEvent = ({ event_action, event_label }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "LawyerDetailPage", {
      event_category: "Interactions",
      event_action: event_action,
      event_label: JSON.stringify(event_label),
    });
  }
};

export default class Lawyer extends Component {
  static async getInitialProps({ res, query, asPath }) {
    return res
      ? {
          canonicalUrl: asPath,
          results: res.results,
        }
      : fetch(`/lawyer/${query.slug}?ajax=1`)
          .then((response) => response.json())
          .then(({ results }) => ({
            canonicalUrl: asPath,
            results,
          }));
  }

  state = {
    region: DEFAULT_REGION,
    contactDetailsOpen: false,
  };

  componentDidMount() {
    const { results } = this.props;
    const self = this;
    const address = {
      lat: Number(results[0].locality.lat),
      lng: Number(results[0].locality.lon),
    };

    // eslint-disable-next-line - cookie may have come from client or server
    this.setState({ region: getPreferredRegion() });

    // eslint-disable-next-line
    const GoogleMapsLoader = require("google-maps");
    GoogleMapsLoader.KEY = GOOGLE_MAPS_KEY;
    GoogleMapsLoader.load((google) => {
      const map = new google.maps.Map(self.map, {
        zoom: 18,
        center: new google.maps.LatLng(address.lat, address.lng),
      });
      // eslint-disable-next-line
      new google.maps.Marker({ position: address, map });
    });
  }

  render() {
    const { results, canonicalUrl } = this.props;
    const { region, contactDetailsOpen } = this.state;

    return (
      <GlobalLayout
        title={`${results[0].post_title} profile`}
        region={region}
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <div className="content--fade-in">
          <div
            style={{
              marginBottom: "2rem",
              background: "white",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {results[0].featured_image_url && (
              <img
                style={{ marginRight: "1rem" }}
                height="150px"
                width="150px"
                src={getWordpressImage(
                  results[0].featured_image_url,
                  IMAGE_TYPES.THUMB
                )}
                alt=""
              />
            )}
            <div>
              <h1 className="profile__heading">{results[0].post_title}</h1>

              {results[0].sub_heading && <p>{results[0].sub_heading}</p>}
            </div>
          </div>

          {results[0].background && (
            <div className="content-section">
              <h2>Background</h2>
              <div
                dangerouslySetInnerHTML={{ __html: results[0].background }}
              />
            </div>
          )}

          {results[0].experience && (
            <div className="content-section">
              <h2>Examples of work</h2>
              <div
                dangerouslySetInnerHTML={{ __html: results[0].experience }}
              />
            </div>
          )}

          {results[0].endorsements && (
            <div className="content-section">
              <h2>Endorsements</h2>
              <div
                dangerouslySetInnerHTML={{ __html: results[0].endorsements }}
              />
            </div>
          )}

          {(results[0].phone_number ||
            results[0].mobile_number ||
            results[0].fax_number ||
            results[0].email_address ||
            results[0].postal_address) && (
            <div className="content-section">
              <h2>Contact:</h2>
              <div
                role="button"
                tabIndex="0"
                onClick={() => {
                  this.setState({ contactDetailsOpen: true });
                  sendGoogleAnalyticsEvent({
                    event_action: "clickToShowContactDetails",
                    event_label: `{ lawyer: ${results[0].post_title} }`,
                  });
                }}
              >
                {!contactDetailsOpen && (
                  <div className="contact">
                    <ul className="contact-details">
                      {results[0].email_address && (
                        <li>
                          Email:{" "}
                          <a>{results[0].email_address.substr(0, 6)}...</a>
                        </li>
                      )}
                      {results[0].mobile_number && (
                        <li>
                          Mobile:{" "}
                          <a>{results[0].mobile_number.substr(0, 6)}...</a>
                        </li>
                      )}
                      {results[0].phone_number && (
                        <li>
                          Phone:{" "}
                          <a>{results[0].phone_number.substr(0, 6)}...</a>
                        </li>
                      )}
                      {results[0].fax_number && (
                        <li>
                          Fax: <a>{results[0].fax_number.substr(0, 6)}...</a>
                        </li>
                      )}
                      {results[0].postal_address && (
                        <li>
                          Postal address:{" "}
                          <a>{results[0].postal_address.substr(0, 6)}...</a>
                        </li>
                      )}
                      <li>
                        <small>Click to show</small>
                      </li>
                    </ul>
                  </div>
                )}

                {contactDetailsOpen && (
                  <ul className="contact-details contact-details--open">
                    {results[0].email_address && (
                      <li>
                        Email: <a>{results[0].email_address}</a>
                      </li>
                    )}
                    {results[0].mobile_number && (
                      <li>
                        Mobile: <a>{results[0].mobile_number}</a>
                      </li>
                    )}
                    {results[0].phone_number && (
                      <li>
                        Phone: <a>{results[0].phone_number}</a>
                      </li>
                    )}
                    {results[0].fax_number && (
                      <li>
                        Fax: <a>{results[0].fax_number}</a>
                      </li>
                    )}
                    {results[0].postal_address && (
                      <li>
                        Postal address: <a>{results[0].postal_address}</a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="content-section">
            <h2>Specialities</h2>
            <ul>
              {results[0].taxonomies.map((r) => (
                <li key={`tag_${r.slug}`}>
                  <Link
                    prefetch
                    href={`/lawyer-specialty/?slug=${r.slug}&region=New-Zealand&page=1&ajax=1`}
                    as={`/lawyer-specialty/${r.slug}/New-Zealand/1`}
                  >
                    <a>{r.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <h2>Location</h2>
          <div
            ref={(r) => {
              this.map = r;
            }}
            className="map"
          />

          <br />
        </div>
      </GlobalLayout>
    );
  }
}

Lawyer.defaultProps = {
  results: [],
  canonicalUrl: "",
};

Lawyer.propTypes = {
  results: resultsPropTypes,
  canonicalUrl: PropTypes.string,
};
