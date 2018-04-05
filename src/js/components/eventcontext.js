import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import { MONTHS, serverURL, defaultImageURL } from "../appsettings.js";
import { startsWith } from "lodash";
import Divider from "material-ui/Divider";
import moment from "moment";
import Event from "./event.js";
import UserInformation from "./userinformation.js";
import RegistrationInterface from "./registrationinterface.js";
import Payment from "./payment.js";
import Status from "./status.js";

const styles = {};

class EventContext extends React.Component {
  constructor() {
    super();
    this.state = {
      AppState: null
    };
  }
  componentWillMount() {
    this.unsubscribe = AppStore.listen(state =>
      this.setState({ AppState: state })
    );
  }
  componentDidMount() {
    let { id } = this.props.match.params;
    AppActions.loadEvent(id);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    let { classes } = this.props;
    let event = this.state.AppState && this.state.AppState.get("currentEvent");
    if (!event) {
      return <div />;
    }
    let bannerImageURL = event.get("bannerImageURL") || defaultImageURL,
      address = event.get("address") || {},
      startDate = new Date(event.get("startDateTime")),
      endDate = new Date(event.get("endDateTime")),
      timeZone = event.get("timeZone"),
      month = MONTHS[startDate.getMonth()],
      date = new Date(startDate).getDate(),
      name = event.get("name"),
      organizer = event.get("organizerContactDetails") || {},
      description = event.get("description"),
      tags = event.get("tags") || [],
      organizerAddress = "",
      venueAddress = "",
      latitude = 18.5526613,
      longitude = 73.947272,
      { isMobile, isShort } = this.context;
    if (!startsWith(bannerImageURL, "http")) {
      bannerImageURL = `${serverURL}${bannerImageURL}`;
    }
    let key;
    for (key in organizer.address) {
      if (organizer.address[key] && typeof organizer.address[key] == "string") {
        organizerAddress = organizerAddress + organizer.address[key] + ", ";
      }
    }
    for (key in address) {
      if (address[key] && typeof address[key] == "string") {
        venueAddress = venueAddress + address[key] + ", ";
      }
    }
    organizerAddress = organizerAddress.replace(/,\s*$/, "");
    venueAddress = venueAddress.replace(/,\s*$/, "");
    return (
      <div className={isMobile ? "contextParent" : "contextParent marTop20"}>
        <div className={isMobile ? "center-xs" : "row center-xs"}>
          <div className={isMobile ? "col-xs-12" : "col-xs-9 paperParent"}>
            <div className={"row"}>
              <div
                className={isMobile ? "col-xs-12 end-xs" : "col-xs-9 end-xs"}
              >
                <div className={"row end-xs"}>
                  <div className={"col-xs-12 captionDiv"}>
                    <div className={"alignCenter eventContextDescparent"}>
                      <div className={"eventCaption eventTitleColor"}>
                        {name}
                      </div>
                      <div
                        className={"eventBy uppercase eventDescriptionColor"}
                      >
                        {"by"} {organizer.name}
                      </div>
                      <div className="dateTimeFormatsColor">
                        {`${moment(startDate).format(
                          "ddd, MMM Do, YYYY, h:mm A"
                        )} - ${moment(endDate).format(
                          "ddd, MMM Do, YYYY, h:mm A"
                        )}`}
                      </div>
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div className={"start-xs"}>
                    <div className={"mobVenueDetails marTop10"}>
                      <div
                        className={"contextSecTitle contextSectionTitleColor"}
                      >
                        {"When & Where"}
                      </div>
                      <Divider className={"marTop10"} />
                      <div className={"marTop20"}>
                        <div className="orgTit contextSectionHeadingColor">
                          {address.name}
                        </div>
                        <div
                          className={
                            "contextOrgAddress font80p contextSectionDescriptionColor"
                          }
                        >
                          {venueAddress}
                        </div>
                        <div
                          className={"marTop10 font80p dateTimeFormatsColor"}
                        >
                          {`${moment(startDate).format(
                            "ddd, MMM Do, YYYY, h:mm A"
                          )} - ${moment(endDate).format(
                            "ddd, MMM Do, YYYY, h:mm A"
                          )} ${timeZone ? ` - ${timeZone}` : null}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="">
                  <Switch>
                    <Route
                      exact
                      path={"/events/:id/register/details"}
                      component={RegistrationInterface}
                    />
                    <Route
                      exact
                      path={"/events/:id/register/payment"}
                      component={Payment}
                    />
                    <Route
                      exact
                      path={"/events/:id/register/status/:statusID"}
                      component={Status}
                    />
                  </Switch>
                </div>
              </div>
              {!isMobile && (
                <div className={"col-xs-3 start-xs"}>
                  <div
                    className=""
                    style={{ height: "170px", backgroundColor: "lightgrey" }}
                  >
                    <img
                      width={"100%"}
                      height={"170px"}
                      src={bannerImageURL}
                      alt=""
                    />
                  </div>
                  <div className={"contextSectionPane marTop20"}>
                    <div className={"contextSecTitle contextSectionTitleColor"}>
                      {"When & Where"}
                    </div>
                    <Divider className={"marTop10"} />
                    <div className={"marTop20"}>
                      <div className="contextSectionHeadingColor">
                        {address.name}
                      </div>
                      <div
                        className={
                          "contextOrgAddress font80p contextSectionDescriptionColor"
                        }
                      >
                        {venueAddress}
                      </div>
                      <div className={"marTop10 font80p dateTimeFormatsColor"}>
                        {`${moment(startDate).format(
                          "ddd, MMM Do, YYYY, h:mm A"
                        )} - ${moment(endDate).format(
                          "ddd, MMM Do, YYYY, h:mm A"
                        )} ${timeZone ? ` - ${timeZone}` : null}`}
                      </div>
                    </div>
                  </div>
                  <div className={"contextSectionPane marTop20"}>
                    <div className={"contextSecTitle contextSectionTitleColor"}>
                      {"Organizer"}
                    </div>
                    <Divider className={"marTop10"} />
                    <div className="">
                      <div
                        className={"orgnizerName contextSectionHeadingColor"}
                        style={{ paddingLeft: 0 }}
                      >
                        {organizer.name}
                      </div>
                      <div
                        className={
                          "contextOrgAddress font80p contextSectionDescriptionColor"
                        }
                      >
                        {organizerAddress}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventContext.propTypes = {
  classes: PropTypes.object.isRequired
};

EventContext.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

module.exports = withStyles(styles)(EventContext);
