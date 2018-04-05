import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import SearchActions from "../actions/search.js";
import SearchStore from "../stores/search.js";
import SearchTile from "./searchtile.js";
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
      },
      width: "140%"
    },
    textFieldRootLocation: {
      padding: 0,
      "label + &": {
        marginTop: theme.spacing.unit * 3
      },
      width: "100%",
      marginLeft: "40.4%"
    },
    textFieldInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 12px",
      width: "calc(100% - 24px)",
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

class SearchEvents extends React.Component {
  constructor() {
    super();
    this.state = {
      SearchState: null,
      selectedType: dateSearchOptions[0],
      searchValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.unsubscribe = SearchStore.listen(state =>
      this.setState({ SearchState: state })
    );
  }
  componentDidMount() {
    let { key } = this.props.match.params;
    this.setState({ searchValue: key });
    SearchActions.loadEvents(key);
    this.searchEvents && this.searchEvents.focus();
  }
  componentWillUnmount() {
    SearchActions.reset();
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
    SearchActions.jumpTo(event.target.value);
  }
  handleNextClick() {
    SearchActions.next();
  }
  handlePrevClick() {
    SearchActions.prev();
  }
  handleSearchValueChange(event) {
    let { key } = this.props.match.params;
    this.setState({ searchValue: event.target.value });
  }
  handleSearch() {
    //AppActions.search(this.state.searchValue);
    if (this.state.searchValue) {
      SearchActions.loadEvents(this.state.searchValue);
      let { history } = this.props;
      history.push({ pathname: `/events/search/${this.state.searchValue}` });
    }
  }
  render() {
    let { classes } = this.props,
      { isMobile } = this.context,
      events = this.state.SearchState && this.state.SearchState.get("events"),
      currentPage =
        this.state.SearchState && this.state.SearchState.get("currentPage"),
      totalPage =
        this.state.SearchState && this.state.SearchState.get("totalPage"),
      searchedResults =
        this.state.SearchState && this.state.SearchState.get("searchedResults"),
      showLoader =
        this.state.SearchState && this.state.SearchState.get("showLoader");
    let searchedResultsString = searchedResults
      ? `${searchedResults} results found for "${this.props.match.params.key}".`
      : `Sorry, we couldn't find any "${this.props.match.params.key}" event.`;
    return (
      <div className="" style={{ backgroundColor: "rgba(42, 168, 244, 0.11)" }}>
        <div className="evetsPane">
          <div className="row center-xs">
            <div className="col-xs-9 eventsRenderer">
              <div className="row center-xs">
                <div className="col-xs-12 eventsSearch">
                  <Paper className={"searchPagePaper"} elevation={4}>
                    <div className="row center-xs">
                      <div className="col-xs-10">
                        <div className={"marTop50 searchBoxes"}>
                          <div className="row center-xs marTop20">
                            <div className="">
                              <TextField
                                placeholder={"Search event or tag"}
                                id={"bootstrap-input"}
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
                            <div className="">
                              <TextField
                                placeholder={"City or location"}
                                id={"bootstrap-input"}
                                InputProps={{
                                  disableUnderline: true,
                                  classes: {
                                    root: classes.textFieldRootLocation,
                                    input: classes.textFieldInput
                                  }
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                  className: classes.textFieldFormLabel
                                }}
                              />
                            </div>
                            <div className={"searchdropdown"}>
                              <Select
                                value={this.state.selectedType}
                                onChange={this.handleChange}
                                name={"selectedType"}
                                className={classes.selectEmpty}
                              >
                                {dateSearchOptions.map(currentOptions => {
                                  return (
                                    <MenuItem
                                      value={currentOptions}
                                      key={currentOptions}
                                    >
                                      {currentOptions}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </div>
                            <div className={""}>
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
                </div>
              </div>
              {showLoader ? (
                <div className="loader marTop20">
                  <CircularProgress size={30} style={{ color: "#a0a2ad" }} />
                </div>
              ) : (
                <div className="marTop20 foundString">
                  {searchedResultsString}
                </div>
              )}
              <div className="marTop20">
                <div className="start-xs">
                  {!!(events && events.size) && (
                    <InfiniteScroll
                      dataLength={(events && events.size) || 0}
                      hasMore={currentPage != totalPage - 1}
                      next={this.handleNextClick}
                      style={{ overflow: "hidden" }}
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
                      <div style={{ overflow: "hidden", overflowY: "auto" }}>
                        {events &&
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
                                  venueAddress =
                                    venueAddress + address[key] + ", ";
                                }
                              }
                              if (
                                bannerImageURL &&
                                !startsWith(bannerImageURL, "http")
                              ) {
                                bannerImageURL = `${serverAttachmentURL}${bannerImageURL}`;
                              }
                              return (
                                <div key={id} style={{}}>
                                  <SearchTile
                                    id={id}
                                    title={title}
                                    tags={tags}
                                    date={moment(startDate).format(
                                      "ddd, MMM Do, YYYY, h:mm A"
                                    )}
                                    address={
                                      venueAddress &&
                                      venueAddress.replace(/,\s*$/, "")
                                    }
                                    onTileClick={this.handleClick.bind(
                                      this,
                                      `/events/${id}`
                                    )}
                                    image={
                                      <div>
                                        <LazyLoad height={"165px"} offset={70}>
                                          <img
                                            src={bannerImageURL}
                                            style={{
                                              width: "100%",
                                              height: "165px"
                                            }}
                                          />
                                        </LazyLoad>
                                      </div>
                                    }
                                  />
                                </div>
                              );
                            })
                            .toArray()}
                      </div>
                    </InfiniteScroll>
                  )}
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

SearchEvents.propTypes = {
  classes: PropTypes.object.isRequired
};
SearchEvents.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(SearchEvents);
