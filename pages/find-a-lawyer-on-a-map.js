/* global fetch */
import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalLayout from "../components/GlobalLayout";
import resultsPropTypes from "../propTypes/results";
import getWordpressImage, { IMAGE_TYPES } from "../lib/getWordpressImage";
import { GOOGLE_MAPS_KEY } from "../constants/config";

import "../lib/polyfills";

export default class FindALawyerOnAMap extends Component {
  static async getInitialProps({ res, asPath }) {
    return res
      ? {
          canonicalUrl: asPath,
          results: res.results,
          totalResults: res.totalResults,
        }
      : fetch("/find-lawyers-on-map?ajax=1")
          .then((response) => response.json())
          .then(({ results, totalResults }) => ({
            canonicalUrl: asPath,
            results,
            totalResults,
          }));
  }

  componentDidMount() {
    const { results } = this.props;
    const self = this;

    // eslint-disable-next-line
    const GoogleMapsLoader = require("google-maps");
    GoogleMapsLoader.KEY = GOOGLE_MAPS_KEY;
    GoogleMapsLoader.load((google) => {
      const infowindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(self.map, {
        zoom: 7,
        center: new google.maps.LatLng(-37.0317656, 172.30261),
      });
      // eslint-disable-next-line
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      results.forEach((result) => {
        const marker = new google.maps.Marker({
          position: {
            lat: Number(result.locality.lat),
            lng: Number(result.locality.lon),
          },
          map,
        });

        infowindow.setContent(`
          <div style = 'width:200px;min-height:40px'
            <h3>${result.post_title} <small>${result.sub_heading}</small></h3>
            <p>${result.background}</p>
          </div>
        `);
        marker.addListener("click", () => infowindow.open(map, marker));

        // Attach click event to the marker.
        ((markr, data) => {
          google.maps.event.addListener(markr, "click", () => {
            let taxonomies = "";
            data.taxonomies.forEach((r) => {
              taxonomies += `<li style="margin: 0 0 0.5rem 0;">${r.name}</li>`;
            });
            // Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            infowindow.setContent(`
              <div style="width:500px; min-height: 174px; display: flex;">
                <div style="position: relative; top: 6px;">
                  <a style="position: fixed;" href="/lawyer/${data.post_name}/">
                    <img style="background: #f1f1f1;" height="150px" width="150px" src="${getWordpressImage(
                      data.featured_image_url,
                      IMAGE_TYPES.THUMB
                    )}" alt="" />
                    <br/>
                    <span>View profile</span>
                  </a>
                </div>
                <div style="margin: 0 0 0 164px;">
                  <h3 style="margin: 6px 0 1rem 0;">${data.post_title} <small>${
              data.sub_heading
            }</small></h3>
                  <ul style="padding: 0 0 0 1rem;">${taxonomies}</ul>
                </div>
              </div>
              `);
          });
        })(marker, result);
      });
    });
  }

  render() {
    const { results, canonicalUrl } = this.props;

    return (
      <GlobalLayout
        title="Find a lawyer on a map"
        canonicalUrl={canonicalUrl}
        description="A description"
      >
        <h1>Find a lawyer on a map</h1>
        <div
          style={{ height: "500px" }}
          ref={(r) => {
            this.map = r;
          }}
          className="map"
        />
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </GlobalLayout>
    );
  }
}

FindALawyerOnAMap.defaultProps = {
  results: [],
  preferredRegion: undefined,
  canonicalUrl: "",
};

FindALawyerOnAMap.propTypes = {
  results: resultsPropTypes,
  canonicalUrl: PropTypes.string,
};
