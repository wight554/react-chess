import React from "react";
import { useSelector } from "react-redux";
import Column from "../Column";
import LettersRow from "../LettersRow";
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
      <Row>Turn: {player}</Row>
      <LettersRow>{letterCells}</LettersRow>
      <Row>
        <Column>{numberCells}</Column>
        {children}
        <Column>{numberCells}</Column>
      </Row>
      <LettersRow>{letterCells}</LettersRow>
    </div>
  );
}
