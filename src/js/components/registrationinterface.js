import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Stepper, { Step, StepLabel } from "material-ui/Stepper";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import UserInformation from "./userinformation.js";
import TicketInfo from "./ticketinfo.js";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Payment from "./payment.js";
import SeesionDetails from "./sessiondetails.js";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Divider from "material-ui/Divider";
const styles = theme => ({});

class RegistartionInterface extends React.Component {
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
  handleProcess() {
    let { id } = this.props.match.params;
    AppActions.processPayment(id, this.props.history);
  }
  getAppBarWithTitle(title) {
    return (
      <div className="start-xs">
        <h4 className="sectionTitleCap contextSectionTitleColor">{title}</h4>
      </div>
    );
  }
  render() {
    const { classes } = this.props;
    let event = this.state.AppState && this.state.AppState.get("currentEvent");
    if (!event) {
      return "";
    }
    let registrationType = (event && event.get("registrationType")) || {},
      tickets = (event && event.get("tickets")) || [],
      sessions = (event && event.get("sessions")) || {},
      speakers = (event && event.get("speakers")) || {},
      timeZone = event.get("timeZone"),
      regResponses =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "registrationResponse"]),
      evtResponses =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "eventSurveyResponse"]),
      ticketDetails =
        this.state.AppState &&
        this.state.AppState.getIn(["responses", "ticketDetails"]),
      selectedTickets = ticketDetails && ticketDetails.get("selectedTickets"),
      processClear =
        this.state.AppState && this.state.AppState.getIn(["processClear"]),
      currency = event && event.get("currency"),
      registrationForm = (event && event.get("registrationForm")) || [],
      eventQuestions = (event && event.get("eventQuestion")) || [],
      registrationTypeKeys = Object.keys(registrationType),
      showRegistrationTitle = true;
    let { isMobile } = this.context;
    showRegistrationTitle = !!registrationTypeKeys.length;
    if (registrationTypeKeys.length == 1) {
      let { maxQuantityAllowed } = registrationType[registrationTypeKeys[0]];
      if (maxQuantityAllowed == 1 && tickets.length == 1) {
        showRegistrationTitle = false;
      }
    }
    return (
      <div className={""}>
        <div className={`row  ${(isMobile && "center-xs") || "end-xs"}`}>
          <div
            className={isMobile ? "mobPadlr20" : "col-xs-12 borderToContent"}
          >
            <div className={""}>
              {!!registrationForm.length && (
                <div>
                  <div className={""}>
                    {this.getAppBarWithTitle("Registrant Information")}
                  </div>
                  <Divider className={"marTop10 marBot20"} />
                </div>
              )}
              <div
                className={
                  isMobile ? "userInfoSection start-xs" : "userInfoSection"
                }
              >
                <UserInformation
                  qType={"registrationResponse"}
                  questions={registrationForm}
                  responses={regResponses}
                />
              </div>
            </div>

            <div className="marTop50">
              {showRegistrationTitle && (
                <div>
                  <div className="">
                    {this.getAppBarWithTitle("Ticket Information")}
                  </div>
                  <Divider className={"marTop10 marBot20"} />
                </div>
              )}
              <div className={"userInfoSection"}>
                <TicketInfo
                  showRegistrationTitle={showRegistrationTitle}
                  registrationType={registrationType}
                  tickets={tickets}
                  sessions={sessions}
                  ticketDetails={ticketDetails}
                  currency={currency}
                />
              </div>
            </div>

            {selectedTickets &&
              !!selectedTickets.size && (
                <SeesionDetails
                  registrationType={registrationType}
                  tickets={tickets}
                  sessions={sessions}
                  ticketDetails={ticketDetails}
                  speakers={speakers}
                  timeZone={timeZone}
                />
              )}
            <div className="marTop50">
              {!!eventQuestions.length && (
                <div>
                  <div className="">
                    {this.getAppBarWithTitle("Tell us more")}
                  </div>
                  <Divider className={"marTop10 marBot20"} />
                </div>
              )}
              <div className={"userInfoSection"}>
                <UserInformation
                  isEventQuestions={true}
                  qType={"eventSurveyResponse"}
                  questions={eventQuestions}
                  responses={evtResponses}
                />
              </div>
              <div
                className={
                  isMobile
                    ? "row end-xs marBot50 padRig7"
                    : "row end-xs marBot20 padRig7"
                }
              >
                <Button
                  disabled={!processClear}
                  variant="raised"
                  color="primary"
                  onClick={this.handleProcess.bind(this)}
                  className={classes.button}
                >
                  {"Checkout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegistartionInterface.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(RegistartionInterface);
