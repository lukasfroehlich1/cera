const React = require('react');
const reactDom = require('react-dom');

const App = require('./components/app.js');

reactDom.render(<App />, document.getElementById('app-mount'));

