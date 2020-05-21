import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import MainNav from './MainNav';
import '../lib/routeEventsHandler';
import { GOOGLE_ANALYTICS_ID } from '../constants/config';

const GlobalLayout = ({ children, title, canonicalUrl, description }) => (
  <div>
    <Head>
      {/* Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)};
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `,
        }}
      />
      <title>{ title }</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" type="text/css" href="/static/styles.css" />
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />

      {description &&
      <meta name="description" content={description} />
      }

      {canonicalUrl &&
      <link rel="canonical" href={`https://listoftings-ui.herokuapp.com${canonicalUrl}`} />
      }
    </Head>

    <MainNav />

    <div className="content">
      { children }
    </div>
  </div>
);

GlobalLayout.defaultProps = {
  title: 'Find a lawyer in New Zealand - LawList',
  region: undefined,
};

GlobalLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  title: PropTypes.string,
  canonicalUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default GlobalLayout;
