import React from "react";
import { getCellColor } from "../../utils";
import "./Square.css";

export default function Square(props) {
  const sendPositon = () => {
    props.handleSquareClick(props);
  };
  return (
    <div
      className="Square"
      style={{ backgroundColor: getCellColor(props) }}
      onClick={sendPositon}
    >
      {props.children}
    </div>
  );
}
