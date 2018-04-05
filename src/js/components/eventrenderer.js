import React from "react";
import Event from "./event.js";
import UserInformation from "./userinformation.js";
import RegistrationInterface from "./registrationinterface.js";
import { Switch, Route } from "react-router";
import Payment from "./payment.js";
import RegistrationRenderer from "./registerrenderer.js";
import EventContext from "./eventcontext.js";
const EventRenderer = props => {
  return (
    <Switch>
      <Route exact path="/events/:id" component={Event} />
      <Route path="/events/:id/register" component={EventContext} />
    </Switch>
  );
};

module.exports = EventRenderer;
