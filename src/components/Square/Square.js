import React, { Component } from "react";
import { getCellColor } from "../../utils";
import "./Square.css";

class Square extends Component {
  sendPositon = () => {
    this.props.handleSquareClick(this.props);
  };
  render() {
    return (
      <div
        className="Square"
        style={{ backgroundColor: getCellColor(this.props) }}
        onClick={this.sendPositon}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Square;
