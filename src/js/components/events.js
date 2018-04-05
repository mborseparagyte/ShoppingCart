import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import TileComponet from "./tilecomponent.js";
import TextField from "material-ui/TextField";
import LazyLoad from "react-lazyload";
import { serverAttachmentURL, defaultImageURL } from "../appsettings.js";
import Paper from "material-ui/Paper";
import purple from "material-ui/colors/purple";
import moment from "moment";
import startsWith from "lodash/startsWith";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Button from "material-ui/Button";
import Footer from "./footer.js";
import PageNavigationComponent from "./pagenavigationcomponent.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "material-ui/Progress";
const styles = theme => ({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing.unit
    },
    inputLabelFocused: {
      color: purple[500]
    },
    inputUnderline: {
      "&:after": {
        backgroundColor: purple[500]
      }
    },
    textFieldRoot: {
      padding: 0,
      "label + &": {
        marginTop: theme.spacing.unit * 3
      }
    },
    textFieldRootLocation: {
      padding: 0,
      "label + &": {
        marginTop: theme.spacing.unit * 3
      },
      marginLeft: "40.4%"
    },
    textFieldInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:focus": {
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
      }
    },
    textFieldFormLabel: {
      fontSize: 18
    },
    selectEmpty: {
      width: "100%",
      lineHeight: "26px"
    }
  }),
  dateSearchOptions = [
    "All Dates",
    "Today",
    "Tomorrow",
    "This Week",
    "This Weekend",
    "Next Week",
    "Next Month"
  ];

class Events extends React.Component {
  constructor() {
    super();
    this.state = {
      AppState: null,
      selectedType: dateSearchOptions[0],
      searchValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.unsubscribe = AppStore.listen(state =>
      this.setState({ AppState: state })
    );
  }
  componentDidMount() {
    AppActions.loadEvents();
    //this.searchEvents && this.searchEvents.focus();
  }
  componentWillUnmount() {
    AppActions.reset();
    this.unsubscribe();
  }
  handleClick(pathname) {
    if (pathname) {
      let { history } = this.props;
      history.push({ pathname });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleJumpTo(event) {
    AppActions.jumpTo(event.target.value);
  }
  handleNextClick() {
    AppActions.next();
  }
  handlePrevClick() {
    AppActions.prev();
  }
  handleSearchValueChange(event) {
    this.setState({ searchValue: event.target.value });
  }
  handleSearch() {
    //AppActions.search(this.state.searchValue);
    if (this.state.searchValue) {
      let { history } = this.props;
      history.push({ pathname: `/events/search/${this.state.searchValue}` });
    }
  }
  render() {
    let { classes } = this.props,
      { isMobile } = this.context,
      events = this.state.AppState && this.state.AppState.get("events"),
      currentPage =
        this.state.AppState && this.state.AppState.get("currentPage"),
      totalPage = this.state.AppState && this.state.AppState.get("totalPage");
    return (
      <div className="" style={{ backgroundColor: "rgba(42, 168, 244, 0.11)" }}>
        <div className="eventimagebackground">
          <img src="./extern/eventsbackground1.jpg" alt="" width="100%" />
        </div>
        <div className="evetsPane">
          <div className="row center-xs">
            <div className="col-xs-10 eventsRenderer">
              <div className="row center-xs">
                <div className="col-xs-12 eventsSearch">
                  <Paper className={"searchPaper"} elevation={4}>
                    <div className="row center-xs">
                      <div className="col-xs-10">
                        <div className="marTop20 marBot20 titleTextEvents" />
                        <div className={"searchBoxes marTop50"}>
                          <div className="row center-xs">
                            <div className="col-xs">
                              <TextField
                                placeholder={"Product search"}
                                value={this.state.searchValue}
                                inputRef={e => (this.searchEvents = e)}
                                InputProps={{
                                  disableUnderline: true,
                                  classes: {
                                    root: classes.textFieldRoot,
                                    input: classes.textFieldInput
                                  }
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                  className: classes.textFieldFormLabel
                                }}
                                onChange={this.handleSearchValueChange.bind(
                                  this
                                )}
                              />
                            </div>
                           
                            <div className={"col-xs"}>
                              <Button
                                variant="raised"
                                className={"searchbutton"}
                                onClick={this.handleSearch.bind(this)}
                              >
                                {"Search"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </div>{" "}
              </div>
              <div className="eventsTile">
                <div className="start-xs">
                  <InfiniteScroll
                    dataLength={(events && events.size) || 0}
                    hasMore={currentPage != totalPage - 1}
                    next={this.handleNextClick}
                    loader={
                      <div className="loader">
                        <CircularProgress
                          size={30}
                          style={{ color: "#a0a2ad" }}
                        />
                      </div>
                    }
                    endMessage={
                      <p style={{ textAlign: "center" }}>
                        <b />
                      </p>
                    }
                  >
                    {(events &&
                      events
                        .map(event => {
                          let id = event.get("id"),
                            title = event.get("Title"),
                            bannerImageURL = event.get("Images").length
                              ? event.get("Images")[0]
                              : defaultImageURL,
                            startDate = event.get("StartDate"),
                            address = event.get("_VenueAddress"),
                            tags = event.get("Tags"),
                            venueAddress = "",
                            key;
                          for (key in address) {
                            if (
                              address[key] &&
                              typeof address[key] == "string"
                            ) {
                              venueAddress = venueAddress + address[key] + ", ";
                            }
                          }
                          if (
                            bannerImageURL &&
                            !startsWith(bannerImageURL, "http")
                          ) {
                            bannerImageURL = `${serverAttachmentURL}${bannerImageURL}`;
                          }
                          return (
                            <div key={id} style={{ display: "inline-block" }}>
                              <TileComponet
                                id={id}
                                title={title}
                                tags={tags}
                                date={moment(startDate).format(
                                  "ddd, MMM Do, YYYY, h:mm A"
                                )}
                                address={venueAddress}
                                onTileClick={this.handleClick.bind(
                                  this,
                                  `/events/${id}`
                                )}
                                tileContent={
                                  <div
                                    style={{
                                      width: 330,
                                      textAlign: "center",
                                      position: "relative"
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: 338
                                      }}
                                    >
                                      <LazyLoad height={165} offset={70}>
                                        <img
                                          src={bannerImageURL}
                                          style={{
                                            width: 338,
                                            height: 165
                                          }}
                                        />
                                      </LazyLoad>
                                    </span>
                                  </div>
                                }
                              />{" "}
                            </div>
                          );
                        })
                        .toArray()) ||
                      []}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footerParent">
          <Footer />
        </div>
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.object.isRequired
};
Events.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(Events);
