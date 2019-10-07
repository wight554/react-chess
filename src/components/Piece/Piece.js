import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { images } from "../../constants";

export default function Piece({ name, color }) {
  return <FontAwesomeIcon icon={images[name]} alt={name} style={{ color }} />;
}
