import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Question from "./question.js";
import classNames from "classnames";
import question from "./question.js";
import { indexOf, forIn, filter, intersection, merge, compact } from "lodash";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import Radio, { RadioGroup } from "material-ui/Radio";
import Tooltip from "material-ui/Tooltip";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import Immutable from "immutable";
import moment from "moment";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import deepPurple from "material-ui/colors/deepPurple";

const styles = theme => ({
  avatar: {
    margin: 10,
    marginLeft: "37%",
    border: "1px solid lightgray"
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  purpleAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: deepPurple[500]
  }
});

class SessionDetails extends React.Component {
  handleChangeSession(event, checked) {
    let id = event.target.value;
    let { ticketDetails } = this.props,
      selectedSessions = ticketDetails.get("selectedSessions");
    if (checked) {
      selectedSessions = selectedSessions.add(id);
    } else {
      selectedSessions = selectedSessions.remove(id);
    }
    ticketDetails = ticketDetails.set("selectedSessions", selectedSessions);
    AppActions.setTicketInfo(ticketDetails);
  }
  renderSpeakers(speakerIDs) {
    let { speakers } = this.props;
    return speakerIDs.map(id => {
      let speaker = speakers[id];
      return (
        <div>
          <div className="speakerName">
            {`${speaker.firstName} ${speaker.lastName}`}
            {speaker.title && ` ( ${speaker.title} )`}
          </div>
          <div className="speakerAbout">{speaker.about}</div>
        </div>
      );
    });
  }
  renderSpeakerProfiles(speakerIDs) {
    let { speakers, classes } = this.props;
    return speakerIDs.map(id => {
      let speaker = speakers[id];
      if (!speaker) {
        return;
      }
      return (
        <div
          className="row"
          key={id}
          style={{ display: "table", marginRight: 20 }}
        >
          <div className="">
            <Avatar className={classes.purpleAvatar}>{`${speaker.firstName &&
              speaker.firstName[0]}${speaker.lastName &&
              speaker.lastName[0]}`}</Avatar>
          </div>
          <div
            className=""
            style={{ display: "table-cell", verticalAlign: "middle" }}
          >{`${speaker.firstName} ${speaker.lastName}`}</div>
        </div>
      );
    });
  }
  getAppBarWithTitle(title) {
    return (
      <div className="start-xs">
        <h4 className="sectionTitleCap contextSectionTitleColor">{title}</h4>
      </div>
    );
  }
  renderSessions() {
    let { tickets, sessions, classes, ticketDetails, timeZone } = this.props,
      { isMobile } = this.context;
    if (!sessions) {
      return;
    }
    let filteredSessions = [],
      selectedTickets = ticketDetails.get("selectedTickets").toArray();
    forIn(sessions, session => {
      if (intersection(selectedTickets, session.tickets).length) {
        filteredSessions.push(session);
      }
    });
    if (!filteredSessions.length) {
      return;
    }
    return (
      <div className="marTop50">
        <div className="">{this.getAppBarWithTitle("Select sessions")}</div>
        <Divider className={"marTop10 marBot20"} />
        <div className={"userInfoSection"}>
          {filteredSessions.map((session, index) => {
            let speakers = compact(
              this.renderSpeakerProfiles(session.speakers)
            );
            return (
              <div className="" key={session.id}>
                <div className="row" key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.props.ticketDetails
                          .get("selectedSessions")
                          .has(session.id)}
                        onChange={this.handleChangeSession.bind(this)}
                        value={session.id}
                        color="primary"
                      />
                    }
                    label={
                      <div>
                        <div
                          style={(isMobile && { fontSize: "110%" }) || {}}
                          className="settionTitle sessionHeading"
                        >
                          {session.label}
                        </div>
                      </div>
                    }
                  />
                </div>
                <div className="sessionDetailsPane">
                  <div className="sessionDateTime dateTimeFormatsColor">{`${moment(
                    session.startDateTime
                  ).format("ddd, MMM Do, YYYY, h:mm A")} - ${moment(
                    session.endDateTime
                  ).format("ddd, MMM Do, YYYY, h:mm A")}  ${
                    timeZone ? ` - ${timeZone}` : null
                  }`}</div>
                  <Divider className="marTop10" />
                  {!!speakers.length && (
                    <div className="speakersParent">
                      <div className="SpeakerCap marTop10 marBot10">
                        {"Speakers"}
                      </div>
                      <div className="row">{speakers}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    let { classes } = this.props;
    return <div className={"start-xs"}>{this.renderSessions()}</div>;
  }
}

SessionDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

SessionDetails.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(SessionDetails);
