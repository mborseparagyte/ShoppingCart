import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Question from "./question.js";
import question from "./question.js";
import {
  indexOf,
  forIn,
  filter,
  intersection,
  merge,
  reduce,
  trim,
  toLower
} from "lodash";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import Radio, { RadioGroup } from "material-ui/Radio";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import Immutable from "immutable";
import TextField from "material-ui/TextField";

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
  number: {
    textAlign: "right"
  }
});

class TicketInfo extends React.Component {
  handleChange(evt) {
    let { ticketDetails } = this.props;
    ticketDetails = ticketDetails
      .set("registrationType", evt.target.value)
      .set("selectedTickets", Immutable.Set())
      .set("selectedSessions", Immutable.Set())
      .set("qty", "1")
      .set("totalAmount", "0")
      .set("ticketGroup", "");
    AppActions.setTicketInfo(ticketDetails);
  }
  setRegistrationType(type) {
    let { ticketDetails } = this.props;
    ticketDetails = ticketDetails.set("registrationType", type);
    AppActions.setTicketInfo(ticketDetails);
  }
  getTotalAmount(selectedTickets) {
    let { tickets } = this.props;
    selectedTickets = selectedTickets.toArray();
    return reduce(
      tickets,
      (total, ticket) => {
        if (indexOf(selectedTickets, ticket.id) != -1) {
          return total + ticket.price;
        }
        return total;
      },
      0
    );
  }
  handleChangeTicket(group, event, checked) {
    let id = event.target.value;
    let { ticketDetails } = this.props,
      ticketGroup = ticketDetails.get("ticketGroup"),
      qty = ticketDetails.get("qty"),
      selectedTickets = ticketDetails.get("selectedTickets");
    if (!ticketGroup || toLower(trim(ticketGroup)) == toLower(trim(group))) {
      if (checked) {
        selectedTickets = selectedTickets.add(id);
      } else {
        selectedTickets = selectedTickets.remove(id);
      }
      let totalAmount = this.getTotalAmount(selectedTickets);
      ticketDetails = ticketDetails
        .set("selectedTickets", selectedTickets)
        .set("ticketGroup", (selectedTickets.size && group) || "")
        .set("totalAmount", totalAmount * qty);
      AppActions.setTicketInfo(ticketDetails);
    }
  }
  addTicket(ticket) {
    let { ticketDetails } = this.props,
      { id, group } = ticket,
      ticketGroup = ticketDetails.get("ticketGroup"),
      selectedTickets = ticketDetails.get("selectedTickets");
    selectedTickets = selectedTickets.add(id);
    let totalAmount = this.getTotalAmount(selectedTickets);
    ticketDetails = ticketDetails
      .set("selectedTickets", selectedTickets)
      .set("ticketGroup", (selectedTickets.size && group) || "")
      .set("totalAmount", totalAmount * 1);
    AppActions.setTicketInfo(ticketDetails);
  }
  handleRadioChangeTicket(event, value) {
    let { ticketDetails } = this.props,
      qty = ticketDetails.get("qty"),
      selectedTickets = ticketDetails.get("selectedTickets");
    selectedTickets = selectedTickets.clear();
    selectedTickets = selectedTickets.add(value);
    let totalAmount = this.getTotalAmount(selectedTickets);
    ticketDetails = ticketDetails
      .set("selectedTickets", selectedTickets)
      .set("totalAmount", totalAmount * qty);
    AppActions.setTicketInfo(ticketDetails);
  }
  handleQtyChange(event) {
    let { ticketDetails, tickets, registrationType } = this.props,
      { maxQuantityAllowed } = ticketDetails.get("registrationType")
        ? registrationType[ticketDetails.get("registrationType")] || {}
        : {},
      selectedTickets = ticketDetails.get("selectedTickets");
    let totalAmount = this.getTotalAmount(selectedTickets);
    if (event.target.value > 0 && maxQuantityAllowed >= event.target.value) {
      ticketDetails = ticketDetails
        .set("qty", event.target.value)
        .set("totalAmount", totalAmount * event.target.value);
      AppActions.setTicketInfo(ticketDetails);
    }
  }
  renderQuantity() {
    let {
        ticketDetails,
        classes,
        registrationType,
        showRegistrationTitle
      } = this.props,
      { isMobile } = this.context,
      { maxQuantityAllowed } = ticketDetails.get("registrationType")
        ? registrationType[ticketDetails.get("registrationType")] || {}
        : {},
      selectedTickets = ticketDetails.get("selectedTickets"),
      qty = ticketDetails.get("qty");
    if (maxQuantityAllowed == 1) {
      return;
    }
    if (!selectedTickets.size) {
      return;
    }
    return (
      <div className="row" style={(isMobile && { marginTop: 10 }) || {}}>
        <div
          className={isMobile ? "col-xs-12 fieldlabel" : "col-xs-3 fieldlabel"}
        >
          {"Quantity"}
        </div>
        <div
          style={(isMobile && { marginTop: -15 }) || {}}
          className={isMobile ? "col-xs-12 start-xs" : "col-xs-9 start-xs"}
        >
          <TextField
            id="multiline-flexible"
            type={"number"}
            value={qty || "0"}
            onChange={this.handleQtyChange.bind(this)}
            className={classes.number}
            margin="normal"
            style={{ width: 70 }}
          />
        </div>
      </div>
    );
  }

  getMultipleSelectTicket(tickets) {
    return tickets.map(ticket => {
      let ticketText = `${ticket.label} - ${this.props.currency} ${
          ticket.price
        }`,
        { isMobile } = this.context;
      return (
        <div className={"row start-xs"} key={ticket.id}>
          <FormControlLabel
            style={(isMobile && { marginLeft: -6 }) || {}}
            control={
              <Checkbox
                checked={this.props.ticketDetails
                  .get("selectedTickets")
                  .has(ticket.id)}
                onChange={this.handleChangeTicket.bind(this, ticket.group)}
                value={ticket.id}
                color={"primary"}
              />
            }
            label={ticketText}
          />
        </div>
      );
    });
  }
  getSingleSelectTicket(tickets) {
    let { classes } = this.props;
    return (
      <RadioGroup
        aria-label={"tickets"}
        name={"tickets"}
        className={classes.group}
        value={this.props.ticketDetails.get("selectedTickets").first()}
        onChange={this.handleRadioChangeTicket.bind(this)}
      >
        {tickets.map(ticket => {
          let ticketText = `${ticket.label} - ${this.props.currency} ${
            ticket.price
          }`;
          return (
            <FormControlLabel
              key={ticket.id}
              value={ticket.id}
              control={<Radio color={"primary"} />}
              label={ticketText}
            />
          );
        })}
      </RadioGroup>
    );
  }
  renderTickets() {
    let {
        tickets,
        registrationType,
        classes,
        ticketDetails,
        showRegistrationTitle
      } = this.props,
      { isMobile } = this.context;
    if (!ticketDetails.get("registrationType")) {
      return;
    }
    let { allowMultiple, maxQuantityAllowed } =
        registrationType[ticketDetails.get("registrationType")] || {},
      fTickets = filter(
        tickets,
        ticket =>
          indexOf(
            ticket.registrationType,
            ticketDetails.get("registrationType")
          ) != -1
      );
    if (!fTickets.length) {
      return;
    }
    if (
      maxQuantityAllowed == 1 &&
      fTickets.length == 1 &&
      !showRegistrationTitle
    ) {
      let [ticket] = fTickets;
      !ticketDetails.get("selectedTickets").includes(ticket.id) &&
        this.addTicket(ticket);
      return;
    }
    if (fTickets.length == 1) {
      let [ticket] = fTickets;
      let ticketText = `${ticket.label} - ${this.props.currency} ${
        ticket.price
      }`;
      !ticketDetails.get("selectedTickets").includes(ticket.id) &&
        this.addTicket(ticket);
      return (
        <div className="row" style={{ marginTop: 10 }}>
          <div
            className={
              isMobile ? "col-xs-12 fieldlabel" : "col-xs-3 fieldlabel"
            }
          >
            {"Ticket"}
          </div>
          <div
            style={{ marginTop: 10 }}
            className={isMobile ? "col-xs-12 start-xs" : "start-xs col-xs-9"}
          >
            {ticketText}
          </div>
        </div>
      );
    }
    return (
      <div className="row" style={{ marginTop: 10 }}>
        <div
          className={isMobile ? "col-xs-12 fieldlabel" : "col-xs-3 fieldlabel"}
        >
          {"Select tickets"}
        </div>
        <div className={isMobile ? "col-xs-12 start-xs" : "col-xs-9"}>
          {allowMultiple
            ? this.getMultipleSelectTicket(fTickets)
            : this.getSingleSelectTicket(fTickets)}
        </div>
      </div>
    );
  }
  getRegTypeOptions() {
    let { registrationType, classes, ticketDetails } = this.props,
      options = [];

    forIn(registrationType, type => {
      options.push(
        <option key={type.id} value={type.id}>
          {type.label}
        </option>
      );
    });
    return (
      <Select
        native
        value={ticketDetails.get("registrationType")}
        onChange={this.handleChange.bind(this)}
      >
        <option key={"null"} value="" />
        {options}
      </Select>
    );
  }
  renderRegistrationType() {
    let { registrationType, classes, ticketDetails } = this.props,
      { isMobile } = this.context,
      registrationTypeKeys = Object.keys(registrationType);
    if (!registrationType) {
      return;
    }

    if (!registrationTypeKeys.length) {
      return;
    }
    if (registrationTypeKeys.length == 1) {
      let type = registrationType[registrationTypeKeys[0]];
      ticketDetails.get("registrationType") != type.id &&
        this.setRegistrationType(type.id);
      return;
    }
    return (
      <div className="row">
        <div
          className={isMobile ? "col-xs-12 fieldlabel" : "col-xs-3 fieldlabel"}
        >
          {"Registration type"}
        </div>
        <div
          style={(isMobile && { marginTop: 10 }) || {}}
          className={isMobile ? "col-xs-12 start-xs" : "col-xs-9 start-xs"}
        >
          {this.getRegTypeOptions()}
        </div>
      </div>
    );
  }
  render() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.renderRegistrationType()}
        {this.renderTickets()}
        {this.renderQuantity()}
      </div>
    );
  }
}

TicketInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

TicketInfo.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(TicketInfo);
