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
import indexOf from "lodash/indexOf";
import filter from "lodash/filter";

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

class CheckboxComponent extends React.Component {
  handleChange(event, checked) {
    let id = event.target.value,
      { value } = this.props;
    value = value || [];
    if (checked) {
      value.push(id);
    } else {
      value = filter(value, idV => idV != id);
    }
    // if (indexOf(value, id) == -1) {
    //   value.push(id);
    // } else {
    //   value = filter(value, idV => idV != id);
    // }
    AppActions.setResponse(this.props.qType, this.props.qKey, value);
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
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.fullHeight}>
          {isMobile && this.getLabel()}
          {options.map(option => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={indexOf(value, option) != -1}
                  onChange={this.handleChange.bind(this)}
                  value={option}
                  color="primary"
                />
              }
              label={option}
            />
          ))}
        </Grid>
      </div>
    );
  }
}

CheckboxComponent.propTypes = {
  classes: PropTypes.object.isRequired
};
CheckboxComponent.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(CheckboxComponent);
