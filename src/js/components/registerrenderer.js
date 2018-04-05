import React from "react";
import Event from "./event.js";
import UserInformation from "./userinformation.js";
import RegistrationInterface from "./registrationinterface.js";
import { Switch, Route } from "react-router";
import Payment from "./payment.js";
import Status from "./status.js";
const RegistrationRenderer = props => {
  return (
    <Switch>
      <Route
        exact
        path="/events/:id/register/details"
        component={RegistrationInterface}
      />
      <Route exact path="/events/:id/register/payment" component={Payment} />
      <Route exact path="/events/:id/register/status/:id" component={Status} />
    </Switch>
  );
};

module.exports = RegistrationRenderer;
