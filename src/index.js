import React from 'react';
import { render } from 'react-dom';

import App from './App';

require('../static/stylesheets/main.scss');

render(
  <App />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
