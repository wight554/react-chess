import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import BoardRow from "../BoardRow";
import Piece from "../Piece";
import Square from "../Square";
import {
  changeCheck,
  changeField,
  changeFocus,
  changeMoves,
  changePlayer
} from "../../actions";
import {
  getCheck,
  getField,
  getFocus,
  getMoves,
  getPlayer
} from "../../selectors";
import {
  blue,
  green,
  indigo,
  pink,
  red,
  purple,
  teal,
  yellow,
  black,
  white,
  king,
  pawn,
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  knightL,
  directions
} from "../../constants";
import "./Board.css";
import PromoteForm from "../PromoteForm";

const checkCell = (moves, { x, y }) => {
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].x === x && moves[i].y === y) {
      return true;
    }
  }
  return false;
};

const checkPromote = (moves, { x, y }) => {
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].x === x && moves[i].y === y && moves[i].promote) {
      return true;
    }
  }
  return false;
};

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

const possibleDirections = (field, { x, y }) => {
  const moves = [];
  const {
    name = undefined,
    color = white,
    directions = [],
    firstStep = false
  } = field[y][x];
  let maxStep = 1;
  directions.forEach(d => {
    switch (d) {
      case top: {
        if (name === pawn || name === king) {
          if (firstStep) maxStep = 2;
          else maxStep = 1;
        } else {
          maxStep = y;
        }
        for (let i = y - 1; i >= y - maxStep; i--) {
          if (!field[i]) break;
          if (!field[i][x]) {
            if (name === pawn && i === 0) {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x },
                promote: true
              });
            } else {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({
              route: d,
              y: i,
              x: x,
              beatable: true,
              piece: field[i][x].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case bottom: {
        if (name === pawn || name === king) {
          if (firstStep) maxStep = 2;
          else maxStep = 1;
        } else {
          maxStep = field.length - 1 - y;
        }
        for (let i = y + 1; i <= y + maxStep; i++) {
          if (!field[i]) break;
          if (!field[i][x]) {
            if (name === pawn && i === field.length - 1) {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x },
                promote: true
              });
            } else {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({
              route: d,
              y: i,
              x: x,
              beatable: true,
              piece: field[i][x].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case left: {
        if (name === king) maxStep = 1;
        else maxStep = x;
        for (let i = x - 1; i >= x - maxStep; i--) {
          if (!field[y][i])
            moves.push({
              route: d,
              y: y,
              x: i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y][i].color !== color) {
            moves.push({
              route: d,
              y: y,
              x: i,
              beatable: true,
              piece: field[y][i].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case right: {
        if (name === king) maxStep = 1;
        else maxStep = field.length - x;
        for (let i = x + 1; i <= x + maxStep; i++) {
          if (!field[y][i])
            moves.push({
              route: d,
              y: y,
              x: i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y][i].color !== color) {
            moves.push({
              route: d,
              y: y,
              x: i,
              beatable: true,
              piece: field[y][i].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case topLeft: {
        if (name === king) maxStep = 1;
        else maxStep = x < y ? x : y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y - i]) break;
          if (!field[y - i][x - i] && name !== pawn) {
            moves.push({
              route: d,
              y: y - i,
              x: x - i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          } else if (
            field[y - i][x - i] &&
            field[y - i][x - i].color !== color
          ) {
            if (name === pawn && y - i === 0) {
              moves.push({
                route: d,
                y: y - i,
                x: x - i,
                beatable: true,
                promote: true,
                piece: field[y - i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y - i,
                x: x - i,
                beatable: true,
                piece: field[y - i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case topRight: {
        if (name === king) maxStep = 1;
        else maxStep = x < y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y - i]) break;
          if (!field[y - i][x + i] && name !== pawn)
            moves.push({
              route: d,
              y: y - i,
              x: x + i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y - i][x + i] && field[y - i][x + i].color !== color) {
            if (name === pawn && y - i === 0) {
              moves.push({
                route: d,
                y: y - i,
                x: x + i,
                beatable: true,
                promote: true,
                piece: field[y - i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y - i,
                x: x + i,
                beatable: true,
                piece: field[y - i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case bottomRight: {
        if (name === king) maxStep = 1;
        else maxStep = x > y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y + i]) break;
          if (!field[y + i][x + i] && name !== pawn)
            moves.push({
              route: d,
              y: y + i,
              x: x + i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y + i][x + i] && field[y + i][x + i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({
                route: d,
                y: y + i,
                x: x + i,
                beatable: true,
                promote: true,
                piece: field[y + i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y + i,
                x: x + i,
                beatable: true,
                piece: field[y + i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case bottomLeft: {
        if (name === king) maxStep = 1;
        else
          maxStep = maxStep =
            x < y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y + i]) break;
          if (!field[y + i][x - i] && name !== pawn)
            moves.push({
              route: d,
              y: y + i,
              x: x - i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y + i][x - i] && field[y + i][x - i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({
                route: d,
                y: y + i,
                x: x - i,
                beatable: true,
                promote: true,
                piece: field[y + i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y + i,
                x: x - i,
                beatable: true,
                piece: field[y + i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case knightL: {
        const offset = [1, 2];
        const checkMove = (y, x, pY, pX) => {
          if (field[y]) {
            if (field[y][x]) {
              if (field[y][x].color !== color)
                moves.push({
                  route: d,
                  y,
                  x,
                  beatable: true,
                  piece: field[y][x].name,
                  mover: { ...field[pY][pX], y: pY, x: pX }
                });
            } else {
              moves.push({
                route: d,
                y,
                x,
                beatable: false,
                mover: { ...field[pY][pX], y: pY, x: pX }
              });
            }
          }
        };
        checkMove(y + offset[0], x + offset[1], y, x);
        checkMove(y + offset[0], x - offset[1], y, x);
        checkMove(y - offset[0], x - offset[1], y, x);
        checkMove(y - offset[0], x + offset[1], y, x);
        checkMove(y + offset[1], x + offset[0], y, x);
        checkMove(y + offset[1], x - offset[0], y, x);
        checkMove(y - offset[1], x + offset[0], y, x);
        checkMove(y - offset[1], x - offset[0], y, x);
        break;
      }
      default:
        break;
    }
  });
  return moves;
};

const opponentColor = color => {
  return color === black ? white : black;
};

const getPlayerPieces = (field, color) => {
  const pieces = [];
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j]) {
        if (field[i][j].color === color) {
          pieces.push({ ...field[i][j], x: j, y: i });
        }
      }
    }
  }
  return pieces;
};

const getAllPlayerMoves = (field, pieces) => {
  const allMoves = [];
  for (let i = 0; i < pieces.length; i++) {
    const directions = possibleDirections(field, {
      x: pieces[i].x,
      y: pieces[i].y,
      mover: pieces[i].name
    });
    if (directions.length) allMoves.push(directions);
  }
  return allMoves;
};

const getPieceMoves = (field, piece) => {
  return possibleDirections(field, piece);
};

const getPieceBeatableMoves = moves => {
  const beatableMoves = [];
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].beatable) beatableMoves.push(moves[i]);
  }
  return beatableMoves;
};

const getBeatableMoves = moves => {
  const beatableMoves = [];
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves.length; j++) {
      if (moves[i][j] && moves[i][j].beatable) beatableMoves.push(moves[i][j]);
    }
  }
  return beatableMoves;
};

const getKingInfo = pieces => {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].name === king) {
      return pieces[i];
    }
  }
  // return false if no info
  return false;
};

const checkPieceInBeatableMoves = ({ y, x }, moves) => {
  for (let i = 0; i < moves.length; i++) {
    if (y === moves[i].y && x === moves[i].x) return true;
  }
  return false;
};

const checkCheck = (field, player) => {
  const kingInfo = getKingInfo(getPlayerPieces(field, opponentColor(player)));
  const opponentPieces = getPlayerPieces(field, player);
  const opponentMoves = getAllPlayerMoves(field, opponentPieces);
  const checked = kingInfo
    ? checkPieceInBeatableMoves(kingInfo, getBeatableMoves(opponentMoves))
    : false;
  return checked;
};

const getSavableMoves = (field, player) => {
  const beaterSavableMoves = [];
  const beatableMoves = getBeatableMoves(
    getAllPlayerMoves(field, getPlayerPieces(field, player))
  );
  for (let i = 0; i < beatableMoves.length; i++) {
    if (beatableMoves[i].piece === king) {
      const kingBeatRoute = beatableMoves[i].route;
      const beaterMoves = getPieceMoves(field, beatableMoves[i].mover);
      for (let j = 0; j < beaterMoves.length; j++) {
        // push coverable cells
        if (
          !beaterMoves[j].beatable &&
          // can't cover knight
          beaterMoves[j].route !== knightL &&
          beaterMoves[j].route === kingBeatRoute
        ) {
          beaterSavableMoves.push(beaterMoves[j]);
        }
      }
      // beater can be beated as well
      beaterSavableMoves.push(beatableMoves[i].mover);
    }
  }
  return beaterSavableMoves;
};

const getSaviors = (field, player) => {
  const saviors = [];
  const beaterSavableMoves = getSavableMoves(field, player);
  const ownMoves = getAllPlayerMoves(
    field,
    getPlayerPieces(field, opponentColor(player))
  );
  for (let i = 0; i < ownMoves.length; i++) {
    for (let j = 0; j < ownMoves[i].length; j++) {
      for (let k = 0; k < beaterSavableMoves.length; k++) {
        if (
          ownMoves[i][j].x === beaterSavableMoves[k].x &&
          ownMoves[i][j].y === beaterSavableMoves[k].y
        ) {
          saviors.push(ownMoves[i][j].mover);
        }
      }
    }
  }
  // king can save himself by beating beater
  return saviors;
};

const getOppositeDirection = direction => {
  switch (direction) {
    case top:
      return bottom;
    case bottom:
      return top;
    case left:
      return right;
    case right:
      return left;
    case topLeft:
      return bottomRight;
    case topRight:
      return bottomLeft;
    case bottomLeft:
      return topRight;
    case bottomRight:
      return topLeft;
    default:
      return direction;
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
  handlePromotePawn = choice => {
    const { promote } = this.state;
    const { field, changeField, changeCheck, player } = this.props;
    const newField = JSON.parse(JSON.stringify(field));
    newField[promote.y][promote.x].name = choice;
    newField[promote.y][promote.x].directions = directions[choice];
    changeField(newField);
    let kingInfo = getKingInfo(
      getPlayerPieces(newField, opponentColor(player))
    );
    let checked = checkCheck(newField, player);
    // if check check happened after move, it's checkmate
    if (!checked) {
      kingInfo = getKingInfo(getPlayerPieces(newField, player));
      checked = checkCheck(newField, opponentColor(player));
    }
    if (checked) {
      const saviors = getSaviors(newField, player);
      // if there are cells that can be covered
      if (saviors.length) {
        this.setSaviors(saviors);
      } else {
        // checkmate
        this.endGame(opponentColor(kingInfo.color));
      }
      changeCheck(kingInfo.color);
    }
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
          // check if piece is savior
          let savior = false;
          for (let i = 0; i < saviors.length; i++) {
            if (saviors[i].x === x && saviors[i].y === y) {
              savior = saviors[i].name;
            }
          }
          changeFocus({ y, x });
          const saviorMoves = possibleDirections(field, { y, x });
          const savableMoves = getSavableMoves(field, opponentColor(player));
          if (savior === king) {
            // for king we can go only to betable cells
            let newMoves = saviorMoves.filter(function(obj) {
              return !savableMoves.some(function(obj2) {
                return (
                  (obj.y === obj2.y && obj.x === obj2.x) ||
                  (obj.route === obj2.route ||
                    obj.route === getOppositeDirection(obj2.route))
                );
              });
            });
            // latest savable move is potentially beatable
            if (
              savableMoves[savableMoves.length - 1].name &&
              savableMoves[savableMoves.length - 1].name !== pawn
            ) {
              const checkerMoves = getPieceMoves(
                field,
                savableMoves[savableMoves.length - 1]
              );
              const checkerBeatable = checkPieceInBeatableMoves(
                savableMoves[savableMoves.length - 1],
                saviorMoves
              );
              if (checkerBeatable) {
                newMoves = newMoves.filter(function(obj) {
                  return !checkerMoves.some(function(obj2) {
                    return (
                      (obj.y === obj2.y && obj.x === obj2.x) ||
                      (obj.route === obj2.route ||
                        obj.route === getOppositeDirection(obj2.route))
                    );
                  });
                });
              }
            }
            for (let i = 0; i < saviorMoves.length; i++) {
              if (saviorMoves[i].beatable) {
                newMoves.push(saviorMoves[i]);
              }
            }
            changeMoves(newMoves);
          } else if (savior) {
            const newMoves = [];
            for (let i = 0; i < savableMoves.length; i++) {
              for (let j = 0; j < saviorMoves.length; j++) {
                if (
                  savableMoves[i].y === saviorMoves[j].y &&
                  savableMoves[i].x === saviorMoves[j].x
                ) {
                  newMoves.push(saviorMoves[j]);
                }
              }
            }
            changeMoves(newMoves);
          }
        } else {
          changeFocus({ y, x });
          changeMoves(possibleDirections(field, { y, x }));
        }
      } else {
        changeFocus(false);
        changeMoves([]);
      }
    } else if (focus && (!field[y][x] || field[y][x].color !== player)) {
      const grid = [...field].map((row, rIdx) => {
        if (rIdx === y) {
          row = row.map((cell, cIdx) => {
            if (cIdx === x) {
              const piece = field[focus.y][focus.x];
              // movement logic
              if (checkPromote(moves, { x, y })) {
                this.openModal();
                this.setState({
                  promote: {
                    x,
                    y
                  }
                });
              }
              if (checkCell(moves, { x, y })) {
                cell = piece;
              }
              if (cell && piece.firstStep) cell.firstStep = false;
            }
            return cell;
          });
        }
        return row;
      });
      if (grid[y][x] !== field[y][x]) {
        if (x !== focus.x || y !== focus.y) grid[focus.y][focus.x] = null;
        changeFocus(false);
        changeMoves([]);
        changePlayer(opponentColor(player));
        changeField(grid);
        let kingInfo = getKingInfo(
          getPlayerPieces(grid, opponentColor(player))
        );
        let checked = checkCheck(grid, player);
        // if check check happened after move, it's checkmate
        if (!checked) {
          kingInfo = getKingInfo(getPlayerPieces(grid, player));
          checked = checkCheck(grid, opponentColor(player));
        }
        if (checked) {
          const saviors = getSaviors(grid, player);
          let kingIsSavior = false;
          for (let i = 0; i < saviors.length; i++) {
            if (saviors[i].name === king) {
              kingIsSavior = true;
            }
          }
          // if there are cells that can be covered
          if (saviors.length) {
            // the savior is king
            if (kingIsSavior) {
              // king can beat the king
              const kingMoves = getPieceMoves(
                grid,
                getKingInfo(getPlayerPieces(grid, player))
              );
              const kingBeatables = getPieceBeatableMoves(kingMoves);
              for (let i = 0; i < kingBeatables.length; i++) {
                if (kingBeatables[i].piece === king) {
                  // the game is ended
                  this.endGame(kingInfo.color);
                }
              }
              this.setSaviors(saviors);
            } else {
              this.setSaviors(saviors);
            }
          } else {
            // checkmate
            this.endGame(opponentColor(kingInfo.color));
          }
          this.props.changeCheck(kingInfo.color);
        } else {
          this.setSaviors([]);
          this.props.changeCheck("");
        }
      }
    }
  };
  renderField = () => {
    const size = 8;
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
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        let piece = "";
        let color = "";
        if (field[i][j]) {
          piece = <Piece color={field[i][j].color} name={field[i][j].name} />;
        }
        for (let k = 0; k < moves.length; k++) {
          if (moves[k]) {
            if (moves[k].x === j && moves[k].y === i) {
              if (moves[k].promote && moves[k].beatable) color = teal;
              else if (moves[k].promote) color = pink;
              else if (moves[k].beatable) color = green;
              else color = blue;
            }
          }
        }
        if (i === kingInfo.y && j === kingInfo.x && check === kingInfo.color)
          color = yellow;
        if (saviors.length) {
          for (let k = 0; k < saviors.length; k++) {
            if (i === saviors[k].y && j === saviors[k].x) {
              if (saviors[k].name === king) {
                color = indigo;
              } else {
                color = purple;
              }
            }
          }
        }
        if (i === y && j === x && field[i][j]) color = red;
        row.push(
          <Square
            x={j}
            y={i}
            key={`x-${j} y-${i}`}
            focus={focus}
            color={color}
            handleSquareClick={this.handleSquareClick}
          >
            {piece}
          </Square>
        );
      }
      board[i] = (
        <BoardRow y={i} key={`y-${i}`}>
          {row}
        </BoardRow>
      );
    }
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

const mapStateToProps = state => ({
  check: getCheck(state),
  field: getField(state),
  focus: getFocus(state),
  moves: getMoves(state),
  player: getPlayer(state)
});

export default connect(
  mapStateToProps,
  { changeCheck, changeField, changeFocus, changeMoves, changePlayer }
)(Board);
