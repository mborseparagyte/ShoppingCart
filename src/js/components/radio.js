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
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    textAlign: "left",
    marginBottom: 10
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

class RadioComponent extends React.Component {
  handleChange(event, value) {
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
          <RadioGroup
            aria-label="gender"
            name="gender2"
            style={{
              marginTop: (isMobile && -20) || 0
            }}
            className={classes.root}
            value={value}
            onChange={this.handleChange.bind(this)}
          >
            {options.map(option => {
              return (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                />
              );
            })}
          </RadioGroup>
        </Grid>
      </div>
    );
  }
}

RadioComponent.propTypes = {
  classes: PropTypes.object.isRequired
};
RadioComponent.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(RadioComponent);
