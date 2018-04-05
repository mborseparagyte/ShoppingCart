import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import _ from "lodash";
import GeoPattern from "geopattern";
import Divider from "material-ui/Divider";
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  chip: {
    marginRight: 10
  },
  paper: theme.mixins.gutters({
    width: 330,
    display: "inline-flex",
    margin: 10,
    borderRadius: 0
  })
});
class SearchTile extends React.Component {
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
      tags,
      image
    } = this.props;
    pattern = pattern || GeoPattern.generate(id);
    let backgroundPattern = pattern.toDataUrl(),
      backgroundPatternColor = pattern.color;
    title = _.truncate(title, { length: 60 });
    address = _.truncate(address, { length: 50 });
    return (
      <Paper
        style={{
          margin: "10px 0px",
          borderRadius: 0
        }}
      >
        <div className="row">
          <div className="col-xs-3 searchimage" onClick={onTileClick}>
            {image}
          </div>
          <div className="col-xs-9 start-xs padLef0">
            <div className="searchTileContent" onClick={onTileClick}>
              <div className="dateTimeFormatsColor searchedDate">{date} </div>
              <div className="searchedTitle eventTitleColor"> {title}</div>
              <div className="searchedAddress eventDescriptionColor">
                {address}
              </div>
            </div>
            <div className="tagsParent">
              {tags &&
                tags.map((tag, index) => (
                  <span key={index} className="searchTag">
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Paper>
    );
  }
  render() {
    return (
      <div className="row center-xs">
        <div
          style={this.props.tileContainerStyle || {}}
          className="searchTilesParent"
        >
          {this.getGridView()}
        </div>
      </div>
    );
  }
}
SearchTile.propTypes = {
  classes: PropTypes.object.isRequired
};

SearchTile.contextTypes = {
  isMobile: PropTypes.bool,
  isShort: PropTypes.bool
};

export default withStyles(styles)(SearchTile);
