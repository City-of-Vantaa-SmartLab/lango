import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Amplify, { Analytics } from 'aws-amplify';

import ErrorHandler from 'containers/ErrorHandler';
import App from 'containers/App';
import { config } from 'utils/login-configuration';
import store from 'store';
import { GlobalStyle } from 'styles';

// Load the favicon, the manifest.json file and and logos
import './images/favicon.ico';
import './images/icon-72x72.png';
import './images/icon-96x96.png';
import './images/icon-120x120.png';
import './images/icon-128x128.png';
import './images/icon-144x144.png';
import './images/icon-152x152.png';
import './images/icon-167x167.png';
import './images/icon-180x180.png';
import './images/icon-192x192.png';
import './images/icon-384x384.png';
import './images/icon-512x512.png';
import './images/vantaa_logo.png';
import './images/lango-logo.svg';
import './manifest.json';

import 'normalize.css';

const render = () => {
  Amplify.configure(config);
  Analytics.configure({ disabled: true });
  ReactDOM.render(
    <Provider store={store}>
      <GlobalStyle />
      <ErrorHandler>
        <App />
      </ErrorHandler>
    </Provider>,
    document.getElementById('app')
  );
};

render();

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require

runtime.install({
  onUpdateReady: () => {
    // Tells to new SW to take control immediately
    runtime.applyUpdate();
  },
  onUpdated: () => {
    // Reload the webpage to load into the new version
    window.location.reload();
  },
});
