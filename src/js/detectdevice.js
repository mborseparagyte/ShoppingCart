import React from "react";
import connect from "reflux/src/connect";
import PureRenderMixin from "react-addons-pure-render-mixin";
import MediaQuery from "react-responsive";
import AppRoute from "./approute.js";
class DetectDevice extends React.Component {
  getChildWithProps(isMobile, isShort) {
    return <AppRoute isMobile={isMobile} isShort={isShort} {...this.props} />;
  }
  render() {
    return (
      <div>
        <MediaQuery query="(min-device-width: 1224px)">
          <MediaQuery query="(min-width: 808px)">
            {this.getChildWithProps(false)}
          </MediaQuery>
          <MediaQuery query="(max-width: 807px) and (min-width: 471px)">
            {this.getChildWithProps(true)}
          </MediaQuery>
          <MediaQuery query="(max-width: 470px)">
            {this.getChildWithProps(true, true)}
          </MediaQuery>
        </MediaQuery>
        <MediaQuery query="(max-device-width: 1224px)">
          <MediaQuery query="(min-width: 471px)">
            {this.getChildWithProps(true)}
          </MediaQuery>
          <MediaQuery query="(max-width: 470px)">
            {this.getChildWithProps(true, true)}
          </MediaQuery>
        </MediaQuery>
      </div>
    );
  }
}
export default DetectDevice;
