/* global document window */
import Router from 'next/router';
import NProgress from 'nprogress';
import { GOOGLE_ANALYTICS_ID } from '../constants/config';

const scrollToPageTop = () => document.body.scrollIntoView();

const sendGoogleAnalyticPageView = () => {
  setTimeout(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GOOGLE_ANALYTICS_ID, {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: window.document.title,
      });
    }
  }, 100);
};

Router.onRouteChangeStart = () => {
  NProgress.start();
  scrollToPageTop();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
  sendGoogleAnalyticPageView();
};
