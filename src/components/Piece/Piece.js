import React from "react";
import { images, colors } from "../../constants";

const { black } = colors;

export default function Piece({ name, color }) {
  return (
    <img
      src={images[name]}
      alt={name}
      style={{ filter: color === black ? "invert(0%)" : "invert(100%)" }}
    />
  );
}
