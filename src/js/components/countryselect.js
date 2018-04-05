import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { render } from "react-dom";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { countries } from "./data";
import { MenuList, MenuItem } from "material-ui/Menu";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: "0px 4px",
    height: "100%",
    textAlign: "left"
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  fullHeight: {
    height: "inherit"
  },
  textField: {
    margin: 0,
    marginBottom: 10
  }
});

class ReactCountrySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStyle: {
        width: 30,
        height: 20
      },
      tag: null
    };
    this.logChange = this.logChange.bind(this);
    this.CountryRenderValue = this.CountryRenderValue.bind(this);
    this.CountryOptionRenderer = this.CountryOptionRenderer.bind(this);
  }

  logChange(val) {
    this.setState({ tag: val });
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(val);
    }
  }

  CountryOptionRenderer(option) {
    const flagImageUrl = this.props.flagImagePath + option.value + ".png";
    const optionStyle = {
      width: 30,
      height: 20
    };
    return (
      <div
        className="row"
        style={{
          color: option.color
        }}
      >
        <div className="col-xs-3">
          <div className="box">
            <img src={flagImageUrl} style={optionStyle} />
          </div>
        </div>
        <div className="col-xs-9">
          <div className="box">
            <label style={{ fontSize: "small" }}>{option.label}</label>
          </div>
        </div>
      </div>
    );
  }

  CountryRenderValue(option) {
    const flagImageUrl = this.props.flagImagePath + option.value + ".png";
    let { isMobile } = this.context;
    if (option.value === undefined) {
      return null;
    } else {
      return (
        <div className="row">
          <div className="col-xs-3">
            <div className="box">
              <img
                src={flagImageUrl}
                style={{
                  ...this.state.imageStyle,
                  marginTop: 7
                }}
                onError={this.onImageError}
              />
            </div>
          </div>
          <div className="col-xs-9">
            <div className="box">
              <label style={{ fontSize: "small" }}>{option.label}</label>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    let { isMobile } = this.context;
    return (
      <div style={{ marginTop: 18 }}>
        <Select
          style={
            (isMobile && { textAlign: "left" }) || {
              width: 200,
              textAlign: "left"
            }
          }
          placeholder="Search country.."
          value={this.state.tag}
          options={countries}
          optionRenderer={this.CountryOptionRenderer}
          backspaceRemoves={true}
          onChange={this.logChange}
          valueRenderer={this.CountryRenderValue}
          multi={this.props.multi}
        />
      </div>
    );
  }
}

ReactCountrySelect.propTypes = {
  classes: PropTypes.object.isRequired
};
ReactCountrySelect.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(ReactCountrySelect);
