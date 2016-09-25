'use strict';

var React = require('react');
var reactDom = require('react-dom');

var App = require('./components/app.js');

reactDom.render(React.createElement(App, null), document.getElementById('app-mount'));