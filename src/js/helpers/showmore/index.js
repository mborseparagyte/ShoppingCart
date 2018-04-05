import React, { Component, PropTypes } from "react";
import Truncate from "react-truncate";

class ShowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      truncated: false
    };
    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }
  static get defaultProps() {
    return {
      lines: 3,
      more: "Show more",
      less: "Show less",
      anchorClass: ""
    };
  }

  handleTruncate(truncated) {
    if (truncated !== this.state.truncated) {
      this.setState({
        truncated
      });
    }
  }

  toggleLines(event) {
    event.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const { children, more, less, lines, anchorClass } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <div>
        <Truncate
          lines={!expanded && lines}
          ellipsis={
            <span>
              ...{" "}
              <a href="#" className={anchorClass} onClick={this.toggleLines}>
                {more}
              </a>
            </span>
          }
          onTruncate={this.handleTruncate}
        >
          {children}
        </Truncate>
        {!truncated &&
          expanded && (
            <span>
              {" "}
              <a href="#" className={anchorClass} onClick={this.toggleLines}>
                {less}
              </a>
            </span>
          )}
      </div>
    );
  }
}

export default ShowMore;
