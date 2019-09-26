import React, { Component } from "react";
import "./BoardRow.css";

class BoardRow extends Component {
  render() {
    return <div className="BoardRow">{this.props.children}</div>;
  }
}

export default BoardRow;
