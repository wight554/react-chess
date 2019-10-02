import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import BoardRow from "../BoardRow";
import Piece from "../Piece";
import Square from "../Square";
import { fieldActions, pieceActions, playerActions } from "../../actions";
import { pieces, piecesDirections, colors } from "../../constants";
import {
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
  getSaviors,
  getAllPlayerMoves
} from "../../utils";
import "./Board.css";
import PromoteForm from "../PromoteForm";

const { king, pawn } = pieces;
const { blue, green, indigo, pink, red, purple, teal, yellow } = colors;

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class Board extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      check: false,
      promote: { x: 8, y: 8 },
      saviors: [],
      winner: ""
    };
  }
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  setSaviors = saviors => {
    this.setState({ saviors });
  };
  endGame = player => {
    this.setState({ winner: player });
    this.openModal();
  };
  newFieldForMove = (field, y, x, focus, moves, updateFieldState) => {
    const newField = JSON.parse(JSON.stringify(field)).map((row, rIdx) => {
      if (rIdx === y) {
        row = row.map((cell, cIdx) => {
          if (cIdx === x) {
            const piece = field[focus.y][focus.x];
            // open modal only when we gonna update field
            if (updateFieldState) {
              if (checkPromote(moves, { x: x, y: y })) {
                this.openModal();
                this.setState({
                  promote: {
                    x: x,
                    y: y
                  }
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
  handleMoveEnd = (field, { y, x }, player) => {
    const { changeCheck } = this.props;
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
              this.newFieldForMove(field, m.y, m.x, { y, x }, mArr, false),
              getOpponentColor(player)
            );
          } else return true;
        });
      });
      const saviors = getSaviors(beaterSavableMoves, ownMoves);
      // if there are cells that can be covered
      if (saviors.length) {
        // the savior is king
        if (saviors.length === 1 && saviors[0].name === king) {
          // if king is the only savior and can't move it's checkmate
          let kingMoves = getPieceMoves(field, saviors[0]);
          kingMoves = kingMoves.filter(
            m =>
              !checkCheck(
                this.newFieldForMove(
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
            this.endGame(getOpponentColor(player));
          } else {
            this.setSaviors(saviors);
          }
        } else {
          this.setSaviors(saviors);
        }
      } else {
        this.endGame(getOpponentColor(player));
      }
      changeCheck(player);
    } else {
      this.setSaviors([]);
      changeCheck("");
    }
  };
  handlePromotePawn = choice => {
    const { promote } = this.state;
    const { field, changeField, player } = this.props;
    const newField = JSON.parse(JSON.stringify(field));
    newField[promote.y][promote.x].name = choice;
    newField[promote.y][promote.x].directions = piecesDirections[choice];
    changeField(newField);
    this.handleMoveEnd(newField, { y: promote.y, x: promote.x }, player);
    this.closeModal();
  };
  handleSquareClick = ({ y, x }) => {
    const {
      check,
      focus,
      field,
      moves,
      player,
      changeField,
      changeFocus,
      changeMoves,
      changePlayer
    } = this.props;
    const { saviors, winner } = this.state;
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
                      (kingBeatMove && kingBeatMove.route === m2.route)
                    );
                  })
              );
            }
            if (kingBeatMove) newMoves.push(kingBeatMove);
            newMoves = newMoves.filter(
              m =>
                !checkCheck(
                  this.newFieldForMove(
                    field,
                    m.y,
                    m.x,
                    { y, x },
                    newMoves,
                    false
                  ),
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
                  this.newFieldForMove(
                    field,
                    m.y,
                    m.x,
                    { y, x },
                    newMoves,
                    false
                  ),
                  getOpponentColor(player)
                )
            );
          }
          if (newMoves.length) {
            changeMoves(newMoves);
            changeFocus({ y, x });
          }
        } else {
          let newMoves = possibleDirections(field, { y, x });
          newMoves = newMoves.filter(
            m =>
              !checkCheck(
                this.newFieldForMove(
                  field,
                  m.y,
                  m.x,
                  { y, x },
                  newMoves,
                  false
                ),
                getOpponentColor(player)
              )
          );
          if (newMoves.length) {
            changeFocus({ y, x });
            changeMoves(newMoves);
          }
        }
      } else {
        changeFocus(false);
        changeMoves([]);
      }
    } else if (focus && (!field[y][x] || field[y][x].color !== player)) {
      const grid = this.newFieldForMove(field, y, x, focus, moves, true);
      if (JSON.stringify(grid[y][x]) !== JSON.stringify(field[y][x])) {
        changeFocus(false);
        changeMoves([]);
        changePlayer(getOpponentColor(player));
        changeField(grid);
        this.handleMoveEnd(grid, { y, x }, getOpponentColor(player));
      }
    }
  };
  renderField = () => {
    let board = [];
    const {
      check,
      field,
      focus: { x, y },
      moves
    } = this.props;
    const { saviors } = this.state;
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
        if (rIdx === y && cIdx === x && c) color = red;
        row.push(
          <Square
            y={rIdx}
            x={cIdx}
            key={`y-${rIdx} x-${cIdx}`}
            focus={focus}
            color={color}
            handleSquareClick={this.handleSquareClick}
          >
            {piece}
          </Square>
        );
      });
      board[rIdx] = (
        <BoardRow y={rIdx} key={`y-${rIdx}`}>
          {row}
        </BoardRow>
      );
    });
    return board;
  };
  render() {
    return (
      <Fragment>
        <Fragment>
          <div>Turn: {this.props.player}</div>
          <div className="Board">
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              contentLabel="Piece Modal"
              style={customStyles}
            >
              {!this.state.winner ? (
                <PromoteForm handlePromotePawn={this.handlePromotePawn} />
              ) : (
                <h1>Game over, winner: {this.state.winner}</h1>
              )}
            </Modal>
            {this.renderField()}
          </div>
        </Fragment>
      </Fragment>
    );
  }
}
const { changeField } = fieldActions;
const { changeFocus, changeMoves } = pieceActions;
const { changeCheck, changePlayer } = playerActions;
const { getField } = fieldSelectors;
const { getFocus, getMoves } = pieceSelectors;
const { getCheck, getPlayer } = playerSelectors;

const mapStateToProps = state => ({
  check: getCheck(state),
  field: getField(state),
  focus: getFocus(state),
  moves: getMoves(state),
  player: getPlayer(state)
});

const mapDispatchToProps = {
  changeField,
  changeCheck,
  changeFocus,
  changeMoves,
  changePlayer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
