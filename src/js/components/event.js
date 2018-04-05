import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import LazyLoad from "react-lazyload";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Chip from "material-ui/Chip";
import EventLocationMap from "./maplocation.js";
import { MONTHS, serverURL, defaultImageURL } from "../appsettings.js";
import startsWith from "lodash/startsWith";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import DirectionsCar from "material-ui-icons/DirectionsCar";
import DirectionsWalk from "material-ui-icons/DirectionsWalk";
import DirectionsBus from "material-ui-icons/DirectionsBus";
import Motorcycle from "material-ui-icons/Motorcycle";
import Tooltip from "material-ui/Tooltip";
import { StickyContainer, Sticky } from "react-sticky";
import moment from "moment";
import ShowMore from "../helpers/showmore";
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  chip: {
    marginRight: 10
  },
  paper: theme.mixins.gutters({
    padding: 0,
    paddingBottom: "20px !important"
  })
});

class Event extends React.Component {
  constructor() {
    super();
    this.state = { AppState: null };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleScrollToMap = this.handleScrollToMap.bind(this);
  }
  componentWillMount() {
    this.unsubscribe = AppStore.listen(state =>
      this.setState({ AppState: state })
    );
  }
  componentDidMount() {
    let { id } = this.props.match.params;
    AppActions.loadEvent(id);
    AppActions.reset();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleRegister() {
    let history = this.props.history,
      { id } = this.props.match.params;
    history.push({ pathname: `/events/${id}/register/details` });
  }
  handleScrollToMap() {
    const tesNode = ReactDOM.findDOMNode(this.refs.locationMap);
    window.scrollTo(0, tesNode.offsetTop);
  }
  render() {
    let { classes } = this.props,
      event = this.state.AppState && this.state.AppState.get("currentEvent");
    if (!event) {
      return (
        <div style={{ textAline: "center", fontSize: "larger" }}>{""}</div>
      );
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
      latlng = address && address.latlng,
      organizerAddress = "",
      venueAddress = "",
      latitude = latlng && parseFloat(latlng.lat),
      longitude = latlng && parseFloat(latlng.lng),
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
      <div className={`${classes.root} row center-xs`}>
        {!isMobile && (
          <div
            className={"backgroundImageBlur"}
            style={{ height: "500px", backgroundColor: "lightgrey" }}
          >
            <LazyLoad height={500}>
              <img src={bannerImageURL} height="500px" alt="" width="100%" />
            </LazyLoad>
          </div>
        )}
        {isMobile && (
          <div className={"mobileregister"}>
            <div className={"boldFont mobIsFree"}>{""}</div>
            <div className="">
              <Button
                variant="raised"
                className={"mobRegBut"}
                onClick={this.handleRegister}
              >
                {"Register"}
              </Button>
            </div>
          </div>
        )}
        <div
          className={
            isMobile ? "col-xs-12 paperParent" : "col-xs-9 paperParent"
          }
          style={{ marginTop: !isMobile && -400 }}
        >
          <Paper
            className={classes.paper}
            style={{ padding: 0, marginTop: !isMobile && 50 }}
          >
            <div className={"row"}>
              <div
                style={{}}
                className={isMobile ? "col-xs-12 image" : "col-xs-8 image"}
              >
                <LazyLoad height={isMobile ? 250 : 350}>
                  <img
                    width="100%"
                    src={bannerImageURL}
                    height={isMobile ? "250px" : "350px"}
                    alt=""
                  />
                </LazyLoad>
              </div>
              <div
                className={
                  isMobile
                    ? "col-xs-12 eventHead start-xs"
                    : "col-xs-4 eventHead start-xs"
                }
              >
                <Grid
                  container
                  className={"overViewpane"}
                  alignItems={"flex-start"}
                  direction={"column"}
                  justify={"space-between"}
                >
                  <Grid>
                    <div className={"boldFont"}>
                      <div>{month}</div>
                      <div>{date}</div>
                    </div>
                  </Grid>
                  <Grid>
                    <div className={"eventTitle"}>
                      <div className={"eventCaption eventTitleColor"}>
                        {name}
                      </div>
                      <div
                        className={"eventBy marTop20 eventDescriptionColor"}
                      >{`by ${organizer.name}`}</div>
                    </div>
                  </Grid>
                  {!isMobile && (
                    <Grid>
                      <div className={"boldFont isFree"}>{""}</div>
                    </Grid>
                  )}
                </Grid>
              </div>
            </div>
            <StickyContainer>
              {!isMobile && (
                <Sticky>
                  {({ isSticky }) => {
                    return isSticky ? (
                      <div className={"sticky"}>
                        <div className={"row"}>
                          <div className={"start-xs col-xs-8 stickyTitle"}>
                            <div className="stickyEventTitle eventTitleColor">
                              {" "}
                              {name}
                            </div>
                            <div className="stickyEventDate dateTimeFormatsColor">
                              {`${moment(startDate).format(
                                "ddd, MMM Do, YYYY, h:mm A"
                              )} - ${moment(endDate).format(
                                "ddd, MMM Do, YYYY, h:mm A"
                              )} ${timeZone ? ` - ${timeZone}` : null}`}
                            </div>
                          </div>
                          <div className={"col-xs end-xs"}>
                            <div className="row" style={{ marginTop: 7 }}>
                              <div className="col-xs-3 freeSticky">
                                <div className="stickyEventTitle">{""}</div>
                              </div>
                              <div className="col-xs">
                                <Button
                                  variant="raised"
                                  className={"stickyRegBut"}
                                  onClick={this.handleRegister}
                                >
                                  {"Register"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={"row"}>
                        <div className={"start-xs"} />
                        <div className={"col-xs end-xs"}>
                          <Button
                            variant="raised"
                            className={"regBut"}
                            onClick={this.handleRegister}
                          >
                            {"Register"}
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </Sticky>
              )}
              <Divider />
              <div className={"row"}>
                <div
                  className={
                    isMobile
                      ? "col-xs-12 row center-xs"
                      : "col-xs-8 row center-xs"
                  }
                >
                  <div className={isMobile ? "col-xs-10" : "col-xs-8"}>
                    <div
                      className={
                        "marTop20 sectionTitle eventSectionTitleColor start-xs"
                      }
                    >
                      {"Description"}
                    </div>
                    <div
                      className={
                        "start-xs marTop10 description eventSectionDescriptionColor"
                      }
                    >
                      <ShowMore
                        lines={5}
                        more="Show more"
                        less="Show less"
                        anchorClass="showMore"
                      >
                        {description}
                      </ShowMore>
                    </div>
                    <div className={"marTop50 alignLeft"}>
                      <div className={"sectionTitle eventSectionTitleColor"}>
                        {"Tags"}
                      </div>
                      <div className={"marTop20 eventSectionDescriptionColor"}>
                        {tags.map(tag => {
                          return (
                            <Chip
                              key={tag}
                              label={tag}
                              className={`${classes.chip} tag`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    isMobile
                      ? "col-xs-12 marTop20 datetimePane center-xs"
                      : "col-xs-4 marTop20 datetimePane"
                  }
                >
                  <div className={"sectionTitle"}>{"Date and time"} </div>
                  <div
                    className={
                      "marTop10 datetimeformatting dateTimeFormatsColor"
                    }
                  >
                    <div className="">
                      {moment(startDate).format("ddd, MMM Do, YYYY, h:mm A")} -{" "}
                    </div>
                    <div className="">
                      {moment(endDate).format("ddd, MMM Do, YYYY, h:mm A")}
                      {timeZone ? ` - ${timeZone}` : null}
                    </div>
                  </div>
                  <div
                    className={"sectionTitle eventSectionTitleColor marTop50"}
                  >
                    {"Location"}{" "}
                  </div>
                  <div className={"locationFormatting "}>{venueAddress}</div>
                  {latitude &&
                    longitude && (
                      <a>
                        <div
                          className="linksColor"
                          onClick={this.handleScrollToMap}
                        >
                          {"View Map"}
                        </div>
                      </a>
                    )}
                </div>
              </div>
              <div className={"marTop20"}> </div>
              <Divider />
              <div className={"marTop50 alignCenter"} ref="locationMap">
                <div className="OrganizerTitle">{organizer.name}</div>
                <div className="marTop10 OrganizerDesc">
                  {`Organizer of ${name}`}
                </div>
              </div>
              <div className={"marTop20"}> </div>
              <Divider />
              {latitude &&
                longitude && (
                  <div className="">
                    <div className="">
                      <EventLocationMap
                        latitude={latitude}
                        longitude={longitude}
                      />
                    </div>
                  </div>
                )}
              <Divider />
              <div className={"marTop20 alignCenter"}>
                <div className={"OrganizerTitle marTop10"}>{name}</div>
                <div className={"marTop10"}> {"at"} </div>
                <div className={"marTop10 OrganizerTitle"}>{address.name} </div>
                <div className={"marTop10 OrganizerAddress"}>
                  {venueAddress}
                </div>
                <div className={"iconsParent marTop20"}>
                  <div className="">
                    <a
                      href={`https://maps.google.com?saddr=Current+Location&daddr=${latitude},${longitude}&driving`}
                      target="_blank"
                    >
                      <Tooltip
                        id="tooltip-bottom"
                        title={"View directions by car in Google Maps"}
                        placement="bottom"
                      >
                        <IconButton
                          color="primary"
                          className={"mapIcon"}
                          aria-label="Add to shopping cart"
                        >
                          <DirectionsCar />
                        </IconButton>
                      </Tooltip>
                    </a>
                  </div>
                  <div className="">
                    <a
                      href={`https://maps.google.com?saddr=Current+Location&dirflg=w&daddr=${latitude},${longitude}`}
                      target="_blank"
                    >
                      <Tooltip
                        id="tooltip-bottom"
                        title={"View walking directions in Google Maps"}
                        placement="bottom"
                      >
                        <IconButton
                          color="primary"
                          className={"mapIcon"}
                          aria-label="Add to shopping cart"
                        >
                          <DirectionsWalk />
                        </IconButton>
                      </Tooltip>
                    </a>
                  </div>
                  <div className="">
                    <a
                      href={`https://maps.google.com?saddr=Current+Location&dirflg=r&daddr=${latitude},${longitude}&mode=transit`}
                      target="_blank"
                    >
                      <Tooltip
                        id="tooltip-bottom"
                        title={
                          "View directions by public transportation in Google Maps"
                        }
                        placement="bottom"
                      >
                        <IconButton
                          color="primary"
                          className={"mapIcon"}
                          aria-label="Add to shopping cart"
                        >
                          <DirectionsBus />
                        </IconButton>
                      </Tooltip>
                    </a>
                  </div>
                  <div className="">
                    <a
                      href={`https://maps.google.com?saddr=Current+Location&dirflg=b&daddr=${latitude},${longitude}&mode=bicycling`}
                      target="_blank"
                    >
                      <Tooltip
                        id="tooltip-bottom"
                        title={"View directions by bike in Google Maps"}
                        placement="bottom"
                      >
                        <IconButton
                          color="primary"
                          className={"mapIcon"}
                          aria-label="Add to shopping cart"
                        >
                          <Motorcycle />
                        </IconButton>
                      </Tooltip>
                    </a>
                  </div>
                </div>
              </div>
            </StickyContainer>
            <div className={"marTop20"}> </div>
          </Paper>
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  classes: PropTypes.object.isRequired
};

Event.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};
export default withStyles(styles)(Event);
