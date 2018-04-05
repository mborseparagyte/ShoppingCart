import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Stepper, { Step, StepLabel } from "material-ui/Stepper";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import UserInformation from "./UserInformation.js";
import TicketInfo from "./ticketinfo.js";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Payment from "./payment.js";

const styles = theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

class HorizontalLinearStepper extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };
  constructor() {
    super();
    this.state = {
      AppState: null,
      activeStep: 0,
      skipped: new Set()
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

  isStepOptional = step => {
    return false;
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  handleNext = () => {
    let activeStep =
      (this.state.AppState && this.state.AppState.get("activeStep")) || 0;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      skipped
    });
    AppActions.validateStep(activeStep + 1);
  };

  getStepContent(step) {
    let event = this.state.AppState && this.state.AppState.get("currentEvent"),
      registrationType = event && event.get("registrationType"),
      tickets = event && event.get("tickets"),
      sessions = event && event.get("sessions"),
      regResponses =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "registrationResponse"]),
      evtResponses =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "eventSurveyResponse"]),
      ticketDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "ticketDetails"]),
      steps = this.getSteps();
    switch (step) {
      case 0:
        return (
          <TicketInfo
            registrationType={registrationType}
            tickets={tickets}
            sessions={sessions}
            ticketDetails={ticketDetails}
          />
        );
      case 1:
        return (
          <UserInformation
            qType="registrationResponse"
            questions={event.get("registrationForm")}
            responses={regResponses}
          />
        );
      case 2:
        return (
          (steps.length == 3 && <Payment />) || (
            <UserInformation
              qType="eventSurveyResponse"
              questions={event.get("eventQuestion")}
              responses={evtResponses}
            />
          )
        );
      case 3:
        return <Payment />;
      default:
        return "Unknown step";
    }
  }
  getSteps() {
    let event = this.state.AppState && this.state.AppState.get("currentEvent");
    if (!event) {
      return;
    }
    if (!event.has("eventQuestion")) {
      return ["Book ticket", "General information", "Payment Details"];
    }
    return [
      "Book ticket",
      "General information",
      "Event Survey",
      "Payment Details"
    ];
  }

  handleBack = () => {
    let activeStep =
      (this.state.AppState && this.state.AppState.get("activeStep")) || 0;
    AppActions.validateStep(activeStep - 1);
  };

  handleSkip = () => {
    let activeStep =
      (this.state.AppState && this.state.AppState.get("activeStep")) || 0;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    const skipped = new Set(this.state.skipped.values());
    skipped.add(activeStep);
    this.setState({
      skipped
    });
    AppActions.validateStep(activeStep + 1);
  };

  handleReset = () => {
    AppActions.validateStep(0);
  };

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    let activeStep =
      (this.state.AppState && this.state.AppState.get("activeStep")) || 0;
    if (!steps) {
      return <div> </div>;
    }
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};
            if (this.isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (this.isStepSkipped(index)) {
              props.completed = false;
            }
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              {this.getStepContent(activeStep)}
              <div className="row end-xs">
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                {this.isStepOptional(activeStep) && (
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  variant="raised"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object.isRequired
};

HorizontalLinearStepper.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(HorizontalLinearStepper);
