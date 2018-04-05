import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField";
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
import QRCode from "./qrcode.js";

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
  select: {
    paddingBottom: 5
  }
});

class Status extends React.Component {
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
  renderSuccess(orderedEvent) {
    let { isMobile } = this.context,
      event = this.state.AppState && this.state.AppState.get("currentEvent"),
      candidateName = orderedEvent.get("FirstName"),
      eventName = event.get("name");
    candidateName = candidateName ? " " + candidateName : "";
    return (
      <div className="statusParent start-xs marTop50">
        <div className="row successMessage">
          {`Congrats${candidateName}, You are going to ${eventName}!`}
        </div>
        <div>
          <div className="row">
            <div
              className={
                isMobile ? "col-xs-3 themeColor" : "col-xs-6 themeColor"
              }
            >
              {"QR Code"}{" "}
            </div>
            <div className={isMobile ? "col-xs-9 themeColor" : "col-xs-6"}>
              <div className="qrCodeClass">
                <QRCode
                  QRTitle={orderedEvent.get("id")}
                  value={orderedEvent.get("id")}
                  size={isMobile ? 50 : 100}
                />
                <div className="font80">{`Click on the QRCode to download`}</div>
              </div>
            </div>
          </div>
          <div className="row marTop20">
            <div
              className={
                isMobile ? "col-xs-3 themeColor" : "col-xs-6 themeColor"
              }
            >
              {"Order Id"}{" "}
            </div>
            <div className={isMobile ? "col-xs-9" : "col-xs-6"}>
              <div className="orderId">{`#${orderedEvent.get("id")}`}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderFailure(orderedEvent) {
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            fontSize: "larger",
            marginTop: 50,
            fontWeight: "bold",
            color: "red"
          }}
        >
          {"Failed to pay, please retry..."}
        </div>
      </div>
    );
  }
  render() {
    let { classes } = this.props,
      { isMobile } = this.context,
      orderedEvent =
        this.state.AppState && this.state.AppState.getIn(["orderedEvent"]);
    if (!orderedEvent) {
      return (
        <div style={{ textAlign: "center", fontSize: "larger", marginTop: 50 }}>
          {"Order not found"}
        </div>
      );
    }
    return (
      <div className={isMobile ? "mobPadlr20" : "borderToContent"}>
        <Grid container spacing={8} className={classes.fullHeight}>
          {orderedEvent.get("Status") == "Success"
            ? this.renderSuccess(orderedEvent)
            : this.renderFailure(orderedEvent)}
        </Grid>
      </div>
    );
  }
}

Status.propTypes = {
  classes: PropTypes.object.isRequired
};

Status.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(Status);
