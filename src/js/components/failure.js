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

class Failure extends React.Component {
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
  render() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={8} className={classes.fullHeight} />
      </div>
    );
  }
}

Failure.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Failure);
