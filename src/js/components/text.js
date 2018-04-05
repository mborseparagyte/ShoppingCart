import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: "0px 4px",
    height: "100%",
    textAlign: "left"
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  fullHeight: {
    height: "inherit"
  },
  textField: {
    margin: 0,
    marginBottom: 10
  }
});

class Text extends React.Component {
  handleChange(event) {
    AppActions.setResponse(
      this.props.qType,
      this.props.qKey,
      event.target.value
    );
  }
  componentDidMount() {
    this.props.focusMe && this.textFocus && this.textFocus.focus();
  }
  getLabel() {
    let { classes, label, isRequired } = this.props;
    return (
      <div className={`${"fieldlabel"}`}>
        {label}
        {isRequired && <span className="reqMark"> *</span>}
      </div>
    );
  }
  render() {
    let { classes, label, multiline, value, type, focusMe } = this.props,
      { isMobile } = this.context;

    if (type == "date") {
      let [currentTime] = new Date().toISOString().split(".");
      return (
        <div className={classes.root}>
          <Grid container spacing={8} className={classes.fullHeight}>
            {isMobile && this.getLabel()}
            <TextField
              inputRef={e => {
                this.textFocus = e;
              }}
              id="multiline-flexible"
              type={"datetime-local"}
              defaultValue={currentTime}
              onChange={this.handleChange.bind(this)}
              className={classes.textField}
              margin="normal"
              style={{ width: isMobile ? "100%" : "70%" }}
            />
          </Grid>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.fullHeight}>
          {isMobile && this.getLabel()}
          {(multiline && (
            <TextField
              inputRef={e => {
                this.textFocus = e;
              }}
              id="multiline-flexible"
              type={type}
              multiline
              value={value || ""}
              onChange={this.handleChange.bind(this)}
              className={classes.textField}
              margin="normal"
              style={{ width: isMobile ? "100%" : "70%" }}
            />
          )) || (
            <TextField
              inputRef={e => {
                this.textFocus = e;
              }}
              id="multiline-flexible"
              type={type}
              value={value || ""}
              onChange={this.handleChange.bind(this)}
              className={classes.textField}
              margin="normal"
              style={{ width: isMobile ? "100%" : "70%" }}
            />
          )}
        </Grid>
      </div>
    );
  }
}

Text.propTypes = {
  classes: PropTypes.object.isRequired
};
Text.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};
export default withStyles(styles)(Text);
