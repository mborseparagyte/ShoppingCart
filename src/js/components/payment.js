import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import TextField from "material-ui/TextField";
import purple from "material-ui/colors/purple";
import Immutable from "immutable";
import Button from "material-ui/Button";
import { filter, indexOf } from "lodash";
import { CircularProgress } from "material-ui/Progress";
import { Divider } from "material-ui";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 4,
    padding: "0px 4px",
    height: "100%"
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  fullHeight: {
    height: "inherit"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit
  },
  inputLabelFocused: {
    color: "#3f51b5"
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
    paymentProcess: {
      padding: "2px 13px"
    }
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
      borderColor: "#3f51b5ba",
      boxShadow: "0 0 0 0.2rem #3f51b54f"
    }
  },
  textFieldFormLabel: {
    fontSize: 18
  }
});
class Payment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      AppState: null,
      focused: "",
      cardType: {
        maxLength: 16
      }
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
  handleInputFocus(e) {
    let { target } = e;
    this.setState({
      focused: target.name
    });
  }
  handleCardNumber(evt) {
    let value = evt.target.value.replace(/ /g, ""),
      { cardType, cNumber } = this.state,
      cardDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "cardDetails"]);
    if (value.length > this.state.cardType.maxLength) {
      return;
    }
    AppActions.setCardtInfo(cardDetails.set("number", value));
  }
  handleCardName(evt) {
    let value = evt.target.value,
      cardDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "cardDetails"]);
    AppActions.setCardtInfo(cardDetails.set("name", value));
  }
  handleCardExpiery(evt) {
    let value = evt.target.value.replace(/ |\//g, ""),
      cardDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "cardDetails"]);
    if (value.length > 4) {
      return;
    }
    AppActions.setCardtInfo(cardDetails.set("expiry", value));
  }
  handleCardCvc(evt) {
    let value = evt.target.value,
      cardDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "cardDetails"]);
    if (value.length > 3) {
      return;
    }
    AppActions.setCardtInfo(cardDetails.set("cvc", value));
  }
  handleCallback(type, isValid) {
    this.setState({ cardType: type });
    console.log(type, isValid); //eslint-disable-line no-console
  }
  handleFinish() {
    AppActions.finish(this.props.history);
  }
  renderSummery(tickets, ticketDetails) {
    let selectedTicketIDs = ticketDetails.get("selectedTickets").toArray(),
      event = this.state.AppState && this.state.AppState.get("currentEvent"),
      qty = ticketDetails.get("qty"),
      totalAmount = ticketDetails.get("totalAmount"),
      currency = event && event.get("currency"),
      selectedTickets = filter(
        tickets,
        ticket => indexOf(selectedTicketIDs, ticket.id) != -1
      );
    if (!selectedTickets.length) {
      return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          {"Please select tickets first"}
        </div>
      );
    }
    return (
      <div className="center-xs marTop20">
        <div className="row marBot20" style={{ color: "#005580" }}>
          <div className={"col-xs font80p start-xs"}>{"TICKET TYPE"}</div>
          <div className={"col-xs font80p"}>{"PRICE"} </div>
          <div className={"col-xs font80p"}>{"QUANTITY"}</div>
          <div className={"col-xs font80p"}>{"SUBTOTAL"}</div>
        </div>
        {selectedTickets.map(ticket => {
          return (
            <div className="row marBot10">
              <div className={"col-xs start-xs"}>{ticket.label}</div>
              <div className={"col-xs"}>{`${currency} ${ticket.price}`}</div>
              <div className={"col-xs"}>{qty} </div>
              <div className={"col-xs"}>{`${currency} ${ticket.price *
                qty}`}</div>
            </div>
          );
        })}
        <div className={"row marTop20 boldFonts"}>
          <div className={"col-xs"} />
          <div className={"col-xs"} />
          <div className={"col-xs contextSectionDescriptionColor"}>
            {"Order total"}
          </div>
          <div className={"col-xs contextSectionDescriptionColor"}>
            {`${currency} ${totalAmount}`}
          </div>
        </div>
      </div>
    );
  }
  getAppBarWithTitle(title) {
    return (
      <div className={"start-xs"}>
        <h4 className={"sectionTitleCap contextSectionTitleColor"}>{title}</h4>
      </div>
    );
  }
  render() {
    let { classes } = this.props,
      event = this.state.AppState && this.state.AppState.get("currentEvent");
    if (!event) {
      return <div />;
    }
    let tickets = event && event.get("tickets"),
      cardDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "cardDetails"]),
      ticketDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "ticketDetails"]),
      pendigStatus =
        this.state.AppState && this.state.AppState.getIn(["pendigStatus"]),
      { focused } = this.state,
      { isMobile } = this.context,
      { name, number, expiry, cvc } = (cardDetails && cardDetails.toJS()) || {};
    return (
      <div className={classes.root}>
        <div className={!isMobile && "row end-xs"}>
          <div
            className={
              isMobile ? "col-xs-12 mobPadlr20" : "col-xs-12 borderToContent"
            }
            style={{ marginTop: 16 }}
          >
            <div className="box">
              <div className="">{this.getAppBarWithTitle("Order Summary")}</div>
              <Divider className={"marTop10 marBot20"} />
              {this.renderSummery(tickets, ticketDetails)}
            </div>
          </div>
        </div>
        {isMobile && <Divider className="marTop10 marBot10" />}
        <div className={!isMobile && "row center-xs"}>
          <div
            className={isMobile ? "mobPadlr20" : "col-xs-12 borderToContent"}
          >
            <div className={"box"}>
              <div className="">
                {this.getAppBarWithTitle("Payment details")}
              </div>
              <Divider className={"marTop10 marBot20"} />
              <div className={"row"}>
                <div
                  className={
                    isMobile ? "col-xs-12 center-xs" : "col-xs-6 end-xs"
                  }
                >
                  <div
                    className={"box"}
                    style={{ marginTop: 24, display: "inline-block" }}
                  >
                    <Cards
                      number={number || ""}
                      name={name || ""}
                      expiry={expiry || ""}
                      cvc={cvc || ""}
                      focused={focused || ""}
                      callback={this.handleCallback.bind(this)}
                    />
                  </div>
                </div>
                <div
                  className={
                    isMobile ? "col-xs-12 mobPadlr20" : "col-xs-6 start-xs"
                  }
                >
                  <div className={"box"}>
                    <form style={{ maxWidth: !isMobile && 300 }}>
                      <div style={{ marginTop: 24 }}>
                        <TextField
                          placeholder={"Card Number"}
                          fullWidth
                          id={"card-input"}
                          value={number || ""}
                          onChange={this.handleCardNumber.bind(this)}
                          InputProps={{
                            disableUnderline: true,
                            type: "tel",
                            name: "number",
                            classes: {
                              root: classes.textFieldRoot,
                              input: classes.textFieldInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: classes.textFieldFormLabel
                          }}
                          onFocus={this.handleInputFocus.bind(this)}
                        />
                        <div
                          className={"themeColor"}
                          style={{
                            fontSize: "90%",
                            marginTop: 5,
                            marginLeft: 5,
                            fontWeight: "bold"
                          }}
                        >
                          {"E.g. 49..., 51..., 36..., 37..."}
                        </div>
                      </div>
                      <div style={{ marginTop: 17 }}>
                        <TextField
                          placeholder={"Name"}
                          fullWidth
                          id={"name-input"}
                          value={name || ""}
                          onChange={this.handleCardName.bind(this)}
                          InputProps={{
                            disableUnderline: true,
                            type: "text",
                            name: "name",
                            classes: {
                              root: classes.textFieldRoot,
                              input: classes.textFieldInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: classes.textFieldFormLabel
                          }}
                          onFocus={this.handleInputFocus.bind(this)}
                        />
                      </div>
                      <div style={{ marginTop: 17 }}>
                        <div className={"row center-xs"}>
                          <div className={"col-xs-8"}>
                            <div className={"box"}>
                              <TextField
                                placeholder={"Valid Thru"}
                                fullWidth
                                id={"expiry-input"}
                                value={expiry || ""}
                                onChange={this.handleCardExpiery.bind(this)}
                                InputProps={{
                                  disableUnderline: true,
                                  type: "tel",
                                  name: "expiry",
                                  classes: {
                                    root: classes.textFieldRoot,
                                    input: classes.textFieldInput
                                  }
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                  className: classes.textFieldFormLabel
                                }}
                                onFocus={this.handleInputFocus.bind(this)}
                              />
                            </div>
                          </div>
                          <div className={"col-xs-4"}>
                            <div className={"box"}>
                              <TextField
                                placeholder={"CVC"}
                                fullWidth
                                id={"expiry-input"}
                                value={cvc || ""}
                                onChange={this.handleCardCvc.bind(this)}
                                InputProps={{
                                  disableUnderline: true,
                                  type: "tel",
                                  name: "cvc",
                                  classes: {
                                    root: classes.textFieldRoot,
                                    input: classes.textFieldInput
                                  }
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                  className: classes.textFieldFormLabel
                                }}
                                onFocus={this.handleInputFocus.bind(this)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={"end-xs marTop20 marBot50"}>
                        <Button
                          disabled={pendigStatus}
                          variant={"raised"}
                          color={"primary"}
                          onClick={this.handleFinish.bind(this)}
                          style={{ padding: pendigStatus && "2px 13px" }}
                        >
                          {pendigStatus ? (
                            <div className={"row"}>
                              <div className={"col-xs"}>
                                <CircularProgress
                                  size={30}
                                  style={{ color: "#a0a2ad" }}
                                />
                              </div>
                              <div className={"alignitcenter"}>
                                {"Processing payment"}
                              </div>
                            </div>
                          ) : (
                            "Pay"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Payment.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};
Payment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Payment);
