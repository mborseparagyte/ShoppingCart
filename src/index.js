import "./helpers/styles.js";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import AppRoute from "./approute.js";
import DetectDevice from "./detectdevice.js";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();

module.exports = ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={DetectDevice} />
  </Router>,
  document.getElementById("app")
);
