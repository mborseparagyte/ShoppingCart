import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField";
import { DateTimePicker } from "material-ui-pickers";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";

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
  }
});

class DateComponent extends React.Component {
  handleChange(date) {
    AppActions.setResponse(
      this.props.qType,
      this.props.qKey,
      date.toISOString()
    );
  }
  render() {
    let { classes, label, value, type } = this.props,
      date = (value && new Date(value)) || new Date();
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div style={{ marginTop: 18 }}>
          <DateTimePicker
            value={date}
            disablePast
            onChange={this.handleChange}
          />
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

DateComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DateComponent);
