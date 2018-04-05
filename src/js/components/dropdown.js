import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
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

class Dropdown extends React.Component {
  handleChange(event) {
    AppActions.setResponse(
      this.props.qType,
      this.props.qKey,
      event.target.value
    );
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
    let { classes, label, multiline, value, type, options } = this.props,
      { isMobile } = this.context;
    return (
      <div>
        {isMobile && this.getLabel()}
        <Select
          native
          value={value}
          className={!isMobile ? classes.select : ""}
          onChange={this.handleChange.bind(this)}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
    );
  }
}
Dropdown.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};
Dropdown.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dropdown);
