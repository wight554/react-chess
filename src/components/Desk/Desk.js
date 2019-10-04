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
import { letters, numbers } from "../../constants";
import { getOpponentColor } from "../../utils";
import "./Desk.css";

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
  const changeStep = newStep => {
    if (newStep < 0 || newStep > history.length - 1) return;
    dispatchChangeHistoryStep(newStep);
    dispatchChangeFocus(false);
    dispatchChangeMoves([]);
    if (newStep === 0) {
      dispatchChangeCheck("");
      dispatchChangeSaviors([]);
      dispatchChangeWinner("");
      dispatchChangePlayer(history[newStep].player);
    } else {
      dispatchChangeCheck(history[newStep].check);
      dispatchChangeSaviors(history[newStep].saviors);
      dispatchChangeWinner(history[newStep].winner);
      dispatchChangePlayer(getOpponentColor(history[newStep].piece.color));
    }
    dispatchChangeField(history[newStep].fieldState);
  };
  const incrementStep = () => {
    changeStep(historyStep + 1);
  };
  const decrementStep = () => {
    changeStep(historyStep - 1);
  };
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
      <Row>
        {historyStep ? <button onClick={decrementStep}>undo</button> : ""}
        {history.length > 1 &&
        historyStep < history.length &&
        historyStep !== history.length - 1 ? (
          <button onClick={incrementStep}>redo</button>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
}
