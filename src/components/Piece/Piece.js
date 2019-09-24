import React, { Component } from 'react';
import { piecesImg } from "../../constants";

class Piece extends Component {
  render() {
    const {name,color} = this.props;
    return (
        <img src={piecesImg[name]} alt={name} style={{filter: color === 'black' ? 'invert(0%)' : 'invert(100%)'}}/>
    );
  }
}

export default Piece;
