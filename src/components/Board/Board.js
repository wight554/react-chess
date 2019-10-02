import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import Column from "../Column";
import Row from "../Row";
import Piece from "../Piece";
import Square from "../Square";
import {
  checkActions,
  fieldActions,
  pieceActions,
  playerActions
} from "../../actions";
import { pieces, piecesDirections, colors } from "../../constants";
import {
  checkSelectors,
  fieldSelectors,
  pieceSelectors,
  playerSelectors
} from "../../selectors";
import {
  checkCell,
  checkPromote,
  possibleDirections,
  getOpponentColor,
  getPlayerPieces,
  getPieceMoves,
  getKingInfo,
  checkCheck,
  getSavableMoves,
  getPossibleSaviors,
  getAllPlayerMoves,
  getOppositeDirection,
  coordinatesToNotanion
} from "../../utils";
import "./Board.css";
import PromoteForm from "../PromoteForm";

const { king, pawn } = pieces;
const { blue, green, indigo, pink, red, purple, teal, yellow } = colors;

Modal.setAppElement("#root");

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const { changeCheck, changeSaviors } = checkActions;
const { changeField, changeHistory } = fieldActions;
const { changeFocus, changeMoves, changePromote } = pieceActions;
const { changePlayer, changeWinner } = playerActions;

const { getCheck, getSaviors } = checkSelectors;
const { getField, getHistory } = fieldSelectors;
const { getFocus, getMoves, getPromote } = pieceSelectors;
const { getPlayer, getWinner } = playerSelectors;

export default function Board() {
  const check = useSelector(getCheck);
  const field = useSelector(getField);
  const focus = useSelector(getFocus);
  const history = useSelector(getHistory);
  const moves = useSelector(getMoves);
  const player = useSelector(getPlayer);
  const promote = useSelector(getPromote);
  const saviors = useSelector(getSaviors);
  const winner = useSelector(getWinner);
  const dispatch = useDispatch();
  const dispatchChangeCheck = check => dispatch(changeCheck(check));
  const dispatchChangeField = field => dispatch(changeField(field));
  const dispatchChangeFocus = focus => dispatch(changeFocus(focus));
  const dispatchChangeHistory = history => dispatch(changeHistory(history));
  const dispatchChangeMoves = moves => dispatch(changeMoves(moves));
  const dispatchChangePlayer = player => dispatch(changePlayer(player));
  const dispatchChangePromote = promote => dispatch(changePromote(promote));
  const dispatchChangeSaviors = saviors => dispatch(changeSaviors(saviors));
  const dispatchChangeWinner = winner => dispatch(changeWinner(winner));
  const [modal, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const endGame = player => {
    dispatchChangeWinner(player);
    openModal();
  };
  const newFieldForMove = (field, y, x, focus, moves, updateFieldState) => {
    const newField = JSON.parse(JSON.stringify(field)).map((row, rIdx) => {
      if (rIdx === y) {
        row = row.map((cell, cIdx) => {
          if (cIdx === x) {
            const piece = field[focus.y][focus.x];
            // open modal only when we gonna update field
            if (updateFieldState) {
              if (checkPromote(moves, { y, x })) {
                openModal();
                dispatchChangePromote({
                  y,
                  x
                });
              }
            }
            if (checkCell(moves, { x: x, y: y })) {
              cell = JSON.parse(JSON.stringify(piece));
              if (cell && piece.firstStep) cell.firstStep = false;
            }
          }
          return cell;
        });
      }
      return row;
    });
    if (JSON.stringify(newField[y][x]) !== JSON.stringify(field[y][x])) {
      if (x !== focus.x || y !== focus.y) newField[focus.y][focus.x] = null;
    }
    return newField;
  };
  const handleMoveEnd = (field, { y, x }, player) => {
    let checked = checkCheck(field, getOpponentColor(player));
    if (checked) {
      const beaterSavableMoves = getSavableMoves(
        field,
        getOpponentColor(player)
      );
      let ownMoves = getAllPlayerMoves(field, getPlayerPieces(field, player));
      ownMoves.forEach(mArr => {
        mArr.filter(m => {
          if (m.mover.name !== king) {
            if (beaterSavableMoves.some(m2 => m2.y === m.y && m2.x === m.x))
              return true;
            return !checkCheck(
              newFieldForMove(field, m.y, m.x, { y, x }, mArr, false),
              getOpponentColor(player)
            );
          } else return true;
        });
      });
      const saviors = getPossibleSaviors(beaterSavableMoves, ownMoves);
      // if there are cells that can be covered
      if (saviors.length) {
        // the savior is king
        if (saviors.length === 1 && saviors[0].name === king) {
          // if king is the only savior and can't move it's checkmate
          let kingMoves = getPieceMoves(field, saviors[0]);
          kingMoves = kingMoves.filter(
            m =>
              !checkCheck(
                newFieldForMove(
                  field,
                  m.y,
                  m.x,
                  { y: saviors[0].y, x: saviors[0].x },
                  kingMoves,
                  false
                ),
                getOpponentColor(player)
              )
          );
          if (!kingMoves.length) {
            endGame(getOpponentColor(player));
          } else {
            dispatchChangeSaviors(saviors);
          }
        } else {
          dispatchChangeSaviors(saviors);
        }
      } else {
        endGame(getOpponentColor(player));
      }
      dispatchChangeCheck(player);
    } else {
      dispatchChangeSaviors([]);
      dispatchChangeCheck("");
    }
  };
  const handlePromotePawn = choice => {
    const newField = JSON.parse(JSON.stringify(field));
    newField[promote.y][promote.x].name = choice;
    newField[promote.y][promote.x].directions = piecesDirections[choice];
    dispatchChangeField(newField);
    handleMoveEnd(newField, { y: promote.y, x: promote.x }, player);
    closeModal();
  };
  const handleSquareClick = ({ y, x }) => {
    if (winner) return;
    if (
      (!focus || field[y][x]) &&
      (field[y][x] && field[y][x].color === player)
    ) {
      if (!focus || field[y][x] !== field[focus.y][focus.x]) {
        if (check === player) {
          let savior = false;
          saviors.forEach(s => {
            if (s.y === y && s.x === x) savior = s;
          });
          const saviorMoves = possibleDirections(field, { y, x });
          const savableMoves = getSavableMoves(field, getOpponentColor(player));
          let newMoves = [];
          if (savior.name === king) {
            let kingBeatMove = false;
            saviorMoves.forEach(m => {
              if (m.beatable) {
                kingBeatMove = m;
              }
            });
            newMoves = saviorMoves.filter(
              m =>
                !savableMoves.some(
                  m2 => (m.x === m2.x && m.y === m2.y) || m.route === m2.route
                )
            );
            // it would be harder to hide from figures higher than pawn
            if (savableMoves[savableMoves.length - 1].name !== pawn) {
              const checkerMoves = getPieceMoves(
                field,
                savableMoves[savableMoves.length - 1]
              );
              newMoves = newMoves.filter(
                m =>
                  !checkerMoves.some(m2 => {
                    return (
                      (m.x === m2.x && m.y === m2.y) ||
                      (kingBeatMove &&
                        getOppositeDirection(kingBeatMove.route) === m.route)
                    );
                  })
              );
            }
            if (kingBeatMove) newMoves.push(kingBeatMove);
            newMoves = newMoves.filter(
              m =>
                !checkCheck(
                  newFieldForMove(field, m.y, m.x, { y, x }, newMoves, false),
                  getOpponentColor(player)
                )
            );
          } else if (savior) {
            savableMoves.forEach(m => {
              saviorMoves.forEach(m2 => {
                if (m.x === m2.x && m.y === m2.y) newMoves.push(m2);
              });
            });
            newMoves = newMoves.filter(
              m =>
                !checkCheck(
                  newFieldForMove(field, m.y, m.x, { y, x }, newMoves, false),
                  getOpponentColor(player)
                )
            );
          }
          if (newMoves.length) {
            dispatchChangeMoves(newMoves);
            dispatchChangeFocus({ y, x });
          }
        } else {
          let newMoves = possibleDirections(field, { y, x });
          newMoves = newMoves.filter(
            m =>
              !checkCheck(
                newFieldForMove(field, m.y, m.x, { y, x }, newMoves, false),
                getOpponentColor(player)
              )
          );
          if (newMoves.length) {
            dispatchChangeFocus({ y, x });
            dispatchChangeMoves(newMoves);
          }
        }
      } else {
        dispatchChangeFocus(false);
        dispatchChangeMoves([]);
      }
    } else if (focus && (!field[y][x] || field[y][x].color !== player)) {
      const grid = newFieldForMove(field, y, x, focus, moves, true);
      if (JSON.stringify(grid[y][x]) !== JSON.stringify(field[y][x])) {
        dispatchChangeFocus(false);
        dispatchChangeMoves([]);
        dispatchChangePlayer(getOpponentColor(player));
        dispatchChangeField(grid);
        handleMoveEnd(grid, { y, x }, getOpponentColor(player));
        let newHistory = [...history];
        newHistory.push({
          piece: field[focus.y][focus.x],
          movedFrom: coordinatesToNotanion({ y: focus.y, x: focus.x }),
          movedTo: coordinatesToNotanion({ y, x }),
          previousFieldState: field
        });
        dispatchChangeHistory(newHistory);
      }
    }
  };
  const renderField = () => {
    let board = [];
    let kingInfo = {};
    if (check) kingInfo = getKingInfo(getPlayerPieces(field, check));
    field.forEach((r, rIdx) => {
      let row = [];
      r.forEach((c, cIdx) => {
        let piece = "";
        let color = "";
        if (c) {
          piece = <Piece color={c.color} name={c.name} />;
        }
        moves.forEach(m => {
          if (m) {
            if (m.y === rIdx && m.x === cIdx) {
              if (m.promote && m.beatable) color = teal;
              else if (m.promote) color = pink;
              else if (m.beatable) color = green;
              else color = blue;
            }
          }
        });
        // can't run or checkmate
        if (
          rIdx === kingInfo.y &&
          cIdx === kingInfo.x &&
          check === kingInfo.color
        )
          color = yellow;
        if (saviors.length) {
          saviors.forEach(s => {
            if (rIdx === s.y && cIdx === s.x) {
              if (s.name === king) {
                color = indigo;
              } else {
                color = purple;
              }
            }
          });
        }
        if (rIdx === focus.y && cIdx === focus.x && c) color = red;
        row.push(
          <Square
            y={rIdx}
            x={cIdx}
            key={`y-${rIdx} x-${cIdx}`}
            focus={focus}
            color={color}
            handleSquareClick={handleSquareClick}
          >
            {piece}
          </Square>
        );
      });
      board[rIdx] = (
        <Row y={rIdx} key={`y-${rIdx}`}>
          {row}
        </Row>
      );
    });
    return board;
  };
  return (
    <Fragment>
      <Fragment>
        <div className="Board">
          <Modal
            isOpen={modal}
            onRequestClose={closeModal}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
            contentLabel="Piece Modal"
            style={modalStyles}
          >
            {!winner ? (
              <PromoteForm handlePromotePawn={handlePromotePawn} />
            ) : (
              <Column>
                <h1>Game over, winner: {winner}</h1>
                <button onClick={closeModal}>OK</button>
              </Column>
            )}
          </Modal>
          {renderField()}
        </div>
      </Fragment>
    </Fragment>
  );
}
