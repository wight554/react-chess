import React from "react";
import { useSelector } from "react-redux";
import Column from "../Column";
import Row from "../Row";
import SymbolCell from "../SymbolCell";
import { playerSelectors } from "../../selectors";
import { letters, numbers } from "../../constants";
import "./Desk.css";

const { getPlayer } = playerSelectors;

export default function Desk({ children }) {
  const player = useSelector(getPlayer);
  const letterCells = letters.map(l => (
    <SymbolCell key={l}>{l.toUpperCase()}</SymbolCell>
  ));
  const numberCells = numbers.map(n => (
    <SymbolCell key={`number-${n}`}>{n}</SymbolCell>
  ));
  return (
    <div className="Desk">
      <Row style={{ padding: "5px 0 10px 0" }}>Turn: {player}</Row>
      <Row style={{ width: "480px" }}>{letterCells}</Row>
      <Row>
        <Column>{numberCells}</Column>
        {children}
        <Column>{numberCells}</Column>
      </Row>
      <Row style={{ width: "480px" }}>{letterCells}</Row>
    </div>
  );
}
