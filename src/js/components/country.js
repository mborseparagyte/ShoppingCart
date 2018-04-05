import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField";
import CountrySelect from "./countryselect.js";

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

class Country extends React.Component {
  handleChange(val) {
    AppActions.setResponse(this.props.qType, this.props.qKey, val.label);
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
    let { classes, label, multiline, value, type } = this.props,
      { isMobile } = this.context;
    return (
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.fullHeight}>
          {isMobile && this.getLabel()}
          <div
            style={
              (isMobile && {
                width: "100%",
                marginBottom: 20,
                marginTop: -10
              }) || { marginBottom: 20 }
            }
          >
            <CountrySelect
              flagImagePath="./extern/flags/"
              onSelect={this.handleChange.bind(this)}
              value={value}
            />
          </div>
        </Grid>
      </div>
    );
  }
}

Country.propTypes = {
  classes: PropTypes.object.isRequired
};
Country.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(Country);
