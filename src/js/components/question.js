import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import QuestionTypeRenderer from "./questiontyperenderer.js";

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

class Question extends React.Component {
  render() {
    let { classes } = this.props,
      Renderer = QuestionTypeRenderer(this.props.componentType),
      { isMobile } = this.context;
    return (
      <div className={classes.root} style={{ paddingRight: isMobile && "7%" }}>
        <Grid container spacing={8} className={classes.fullHeight}>
          <Renderer {...this.props} />
        </Grid>
      </div>
    );
  }
}

Question.propTypes = {
  classes: PropTypes.object.isRequired
};
Question.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};
export default withStyles(styles)(Question);
