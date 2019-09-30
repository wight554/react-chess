import React, { Component } from "react";
import { images, colors } from "../../constants";

class Piece extends Component {
  render() {
    const { name, color } = this.props;
    const { black } = colors;
    return (
      <img
        src={images[name]}
        alt={name}
        style={{ filter: color === black ? "invert(0%)" : "invert(100%)" }}
      />
    );
  }
}

export default Piece;
