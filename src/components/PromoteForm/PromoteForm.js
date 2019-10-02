import React, { useState } from "react";
import { pieces } from "../../constants";
import "./PromoteForm.css";

const { bishop, knight, queen, rook } = pieces;

export default function PromoteForm({ handlePromotePawn }) {
  const [option, setOption] = useState(bishop);
  const handleChange = event => {
    setOption(event.target.name);
  };
  const handleSubmit = event => {
    handlePromotePawn(option);
    event.preventDefault();
  };
  const radioButtons = [bishop, knight, queen, rook].map(p => (
    <label key={p}>
      {p}
      <input
        name={p}
        type="radio"
        onChange={handleChange}
        checked={option === p}
      />
    </label>
  ));
  return (
    <form className="PromoteForm" onSubmit={handleSubmit} method="">
      {radioButtons}
      <input type="submit" />
    </form>
  );
}
