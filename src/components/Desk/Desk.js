import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Board from "../Board";
import Column from "../Column";
import Row from "../Row";
import SymbolCell from "../SymbolCell";
import {
  checkActions,
  fieldActions,
  playerActions,
  pieceActions
} from "../../actions";
import { playerSelectors, fieldSelectors } from "../../selectors";
import { pieces, letters, numbers } from "../../constants";
import { getOpponentColor } from "../../utils";
import "./Desk.css";

const { pawn } = pieces;
const { getHistory, getHistoryStep } = fieldSelectors;
const { getPlayer } = playerSelectors;
const { changeCheck, changeSaviors } = checkActions;
const { changeField, changeHistoryStep } = fieldActions;
const { changeFocus, changeMoves } = pieceActions;
const { changePlayer, changeWinner } = playerActions;

export default function Desk({ children }) {
  const player = useSelector(getPlayer);
  const history = useSelector(getHistory);
  const historyStep = useSelector(getHistoryStep);
  const dispatch = useDispatch();
  const dispatchChangeCheck = check => dispatch(changeCheck(check));
  const dispatchChangeField = field => dispatch(changeField(field));
  const dispatchChangeFocus = field => dispatch(changeFocus(field));
  const dispatchChangeHistoryStep = historyStep =>
    dispatch(changeHistoryStep(historyStep));
  const dispatchChangeMoves = moves => dispatch(changeMoves(moves));
  const dispatchChangePlayer = player => dispatch(changePlayer(player));
  const dispatchChangeSaviors = saviors => dispatch(changeSaviors(saviors));
  const dispatchChangeWinner = winner => dispatch(changeWinner(winner));

  const letterCells = letters.map(l => (
    <SymbolCell key={l}>{l.toUpperCase()}</SymbolCell>
  ));
  const numberCells = numbers.map(n => (
    <SymbolCell key={`number-${n}`}>{n}</SymbolCell>
  ));
  const stepBack = (field, player, check, saviors, winner, step) => {
    if (step !== historyStep) {
      dispatchChangeCheck(check);
      dispatchChangeField(field);
      dispatchChangeFocus(false);
      dispatchChangeHistoryStep(step);
      dispatchChangeMoves([]);
      dispatchChangePlayer(player);
      dispatchChangeSaviors(saviors);
      dispatchChangeWinner(winner);
    }
  };
  const stepsList = history.map((s, i) => {
    if (i === 0) {
      return (
        <button
          onClick={() => stepBack(s.fieldState, s.player, "", [], "", i)}
          key={`${i}-start`}
        >{`Intitial field state`}</button>
      );
    } else {
      return (
        <button
          onClick={() =>
            stepBack(
              s.fieldState,
              getOpponentColor(s.piece.color),
              s.check,
              s.saviors,
              s.winner,
              i
            )
          }
          key={`${i}-${s.movedFrom}-${s.movedTo}`}
        >
          {`${s.piece.color} ${s.promote ? ` ${pawn} promoted to` : ""} 
          ${s.piece.name}: from ${s.movedFrom} to ${s.movedTo}`}
        </button>
      );
    }
  });
  return (
    <div className="Desk">
      <Row>Turn: {player}</Row>
      <Row>{letterCells}</Row>
      <Row>
        <Column>{numberCells}</Column>
        <Board />
        <Column>{numberCells}</Column>
      </Row>
      <Row>{letterCells}</Row>
      <Column>{stepsList}</Column>
    </div>
  );
}
