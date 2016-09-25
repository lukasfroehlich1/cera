"use strict";

var React = require('react');

function App() {
      return React.createElement(
            "div",
            { id: "app" },
            React.createElement(
                  "h1",
                  null,
                  "Hello"
            )
      );
}

module.exports = App;