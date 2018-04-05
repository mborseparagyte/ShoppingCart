import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import FlexBoxGrid from "flexboxgrid";
import AppActions from "../actions/actions.js";
import AppStore from "../stores/store.js";
import Question from "./question.js";
import question from "./question.js";
import { indexOf } from "lodash";

const styles = theme => ({});

class UserInformation extends React.Component {
  renderDynamicMobileForm() {
    let { questions, responses, qType, isEventQuestions } = this.props;
    if (!event) {
      return;
    }
    return questions.map((question, index) => {
      let { displayType, key, label, isRequired } = question,
        { isMobile } = this.context,
        componentType =
          (indexOf(["number", "multiline", "email"], displayType) != -1 &&
            "text") ||
          displayType,
        multiline = displayType == "multiline";
      return (
        <div
          className="row center-xs"
          key={key}
          style={{ marginBottom: isEventQuestions && 10 }}
        >
          <div className="col-xs-12">
            <Question
              focusMe={qType == "registrationResponse" && index == 0}
              componentType={componentType}
              type={displayType}
              multiline={multiline}
              qKey={key}
              qType={qType}
              {...question}
              value={responses && responses.get(key)}
            />
          </div>
        </div>
      );
    });
  }
  renderDynamicForm() {
    let { questions, responses, qType, isEventQuestions } = this.props;
    if (!event) {
      return;
    }
    return questions.map((question, index) => {
      let { displayType, key, label, isRequired } = question,
        { isMobile } = this.context,
        componentType =
          (indexOf(["number", "multiline", "email"], displayType) != -1 &&
            "text") ||
          displayType,
        multiline = displayType == "multiline";
      return (
        <div
          className="row"
          key={key}
          style={{ marginBottom: isEventQuestions && 10 }}
        >
          <div
            className={`${
              isEventQuestions
                ? isMobile
                  ? "col-xs-6 eventQuestionLabel"
                  : "col-xs-6 eventQuestionLabel"
                : isMobile ? "col-xs-4 fieldlabel" : "col-xs-3 fieldlabel"
            }`}
          >
            {label}
            {isRequired && <span className="reqMark"> *</span>}
          </div>
          <div className="col-xs-6">
            <Question
              componentType={
                componentType == "autofill" ? "dropdown" : componentType
              }
              focusMe={qType == "registrationResponse" && index == 0}
              type={displayType}
              multiline={multiline}
              qKey={key}
              qType={qType}
              {...question}
              value={responses && responses.get(key)}
            />
          </div>
        </div>
      );
    });
  }
  render() {
    let { classes } = this.props,
      { isMobile } = this.context;
    return (
      <div className={""}>
        <div>
          {(isMobile && this.renderDynamicMobileForm()) ||
            this.renderDynamicForm()}
        </div>
      </div>
    );
  }
}

UserInformation.propTypes = {
  classes: PropTypes.object.isRequired
};

UserInformation.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(UserInformation);
