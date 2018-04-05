import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import _ from "lodash";
import GeoPattern from "geopattern";
import Divider from "material-ui/Divider";
import Button from 'material-ui/Button';
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  chip: {
    marginRight: 10
  }, 
  quickViewButton:{
    width: "100%",
    backgroundColor: "#1a1a1abf",
    color: "white"
  },
  cartButton: {
    width:"100%",
    backgroundColor:"#57901f",
    color:"white"
  },
  paper: theme.mixins.gutters({
    width: 330,
    display: "inline-flex",
    margin: 10,
    borderRadius: 0
  })
});
class TileComponent extends React.Component {
  lightenColor(hex) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16),
      g = parseInt(hex.substring(2, 4), 16),
      b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},0.5)`;
  }
  getGridView() {
    let {
      classes,
      id,
      isMobile,
      onTileClick,
      title,
      description,
      toolbarOptions,
      pattern,
      showToolbar,
      isSelected,
      date,
      address,
      tags
    } = this.props;
    pattern = pattern || GeoPattern.generate(id);
    let backgroundPattern = pattern.toDataUrl(),
      backgroundPatternColor = pattern.color;
    return (
      <Paper
        style={{
          width: 338,
          display: "inline-flex",
          margin: 10,
          borderRadius: 0
        }}
      >
        <div style={{ textAlign: isMobile && "left" }}>
          <div
            onClick={onTileClick}
            style={{
              borderBottom: `1px solid #ddd`,
              cursor: "pointer",
              height: 165,
              overflow: "hidden"
            }}
          >
            {this.props.tileContent}
          </div>
          <div
            style={{
              width: 330,
              padding: 5 
            }}
          >
            <div
              style={{
                width: 330,
                cursor: "pointer"
              }}
              onClick={onTileClick}
            >
              <div
                style={{
                  fontSize: "90%",
                  color: "#45494E",
                  whiteSpace: "nowrap"
                }}
                className="dateTimeFormatsColor"
              >
                {date}
              </div>
              <div
                style={{
                  fontWeight: "600",
                  margin: "10px 0px",
                  height: 40,
                  color: "#282C35"
                }}
              >
                {_.truncate(title, { length: 60 })}
              </div>
              <div style={{ color: "#666A73", fontSize: "small" }}>
                {_.truncate(address, { length: 50 })}
              </div>
              <Divider
                style={{
                  margin: "5px 0px"
                }}
              />
              <div className="row">
                <div className="col-xs-6">
                  <Button variant="raised" className={classes.quickViewButton}>
                    Quick view
      </Button>
                </div>
                <div className="col-xs-6">
                  <Button variant="raised" className={classes.cartButton}>
                    Add to cart
      </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
  render() {
    return (
      <div style={this.props.tileContainerStyle || {}}>
        {this.getGridView()}
      </div>
    );
  }
}
TileComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

TileComponent.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(TileComponent);
