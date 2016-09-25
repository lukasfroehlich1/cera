'use strict';

const React = require('react'),
      reactDom = require('react-dom');

const App = require('./components/app.js');

reactDom.render(<App />, document.getElementById('app-mount'));

