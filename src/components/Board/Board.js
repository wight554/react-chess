import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import BoardRow from "../BoardRow";
import Piece from "../Piece";
import Square from "../Square";
import {
  changeField,
  changeFocus,
  changeMoves,
  changePlayer
} from "../../actions";
import { getField, getFocus, getMoves, getPlayer } from "../../selectors";
import {
  blue,
  green,
  pink,
  red,
  teal,
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
              moves.push({ y: i, x: x, beatable: false, promote: true });
            } else {
              moves.push({ y: i, x: x, beatable: false });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({ y: i, x: x, beatable: true });
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
              moves.push({ y: i, x: x, beatable: false, promote: true });
            } else {
              moves.push({ y: i, x: x, beatable: false });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({ y: i, x: x, beatable: true });
            break;
          } else break;
        }
        break;
      }
      case left: {
        if (name === king) maxStep = 1;
        else maxStep = x;
        for (let i = x - 1; i >= x - maxStep; i--) {
          if (!field[y][i]) moves.push({ y: y, x: i, beatable: false });
          else if (field[y][i].color !== color) {
            moves.push({ y: y, x: i, beatable: true });
            break;
          } else break;
        }
        break;
      }
      case right: {
        if (name === king) maxStep = 1;
        else maxStep = field.length - x;
        for (let i = x + 1; i <= x + maxStep; i++) {
          if (!field[y][i]) moves.push({ y: y, x: i, beatable: false });
          else if (field[y][i].color !== color) {
            moves.push({ y: y, x: i, beatable: true });
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
            moves.push({ y: y - i, x: x - i, beatable: false });
          } else if (
            field[y - i][x - i] &&
            field[y - i][x - i].color !== color
          ) {
            if (name === pawn && y - i === 0) {
              moves.push({ y: y - i, x: x - i, beatable: true, promote: true });
            } else {
              moves.push({ y: y - i, x: x - i, beatable: true });
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
            moves.push({ y: y - i, x: x + i, beatable: false });
          else if (field[y - i][x + i] && field[y - i][x + i].color !== color) {
            if (name === pawn && y - i === 0) {
              moves.push({ y: y - i, x: x + i, beatable: true, promote: true });
            } else {
              moves.push({ y: y - i, x: x + i, beatable: true });
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
            moves.push({ y: y + i, x: x + i, beatable: false });
          else if (field[y + i][x + i] && field[y + i][x + i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({ y: y + i, x: x + i, beatable: true, promote: true });
            } else {
              moves.push({ y: y + i, x: x + i, beatable: true });
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
            moves.push({ y: y + i, x: x - i, beatable: false });
          else if (field[y + i][x - i] && field[y + i][x - i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({ y: y + i, x: x - i, beatable: true, promote: true });
            } else {
              moves.push({ y: y + i, x: x - i, beatable: true });
            }
            break;
          } else break;
        }
        break;
      }
      case knightL: {
        const offset = [1, 2];
        const checkMove = (y, x) => {
          if (field[y]) {
            if (field[y][x]) {
              if (field[y][x].color !== color)
                moves.push({
                  y,
                  x,
                  beatable: true
                });
            } else {
              moves.push({ y, x, beatable: false });
            }
          }
        };
        checkMove(y + offset[0], x + offset[1]);
        checkMove(y + offset[0], x - offset[1]);
        checkMove(y - offset[0], x - offset[1]);
        checkMove(y - offset[0], x + offset[1]);
        checkMove(y + offset[1], x + offset[0]);
        checkMove(y + offset[1], x - offset[0]);
        checkMove(y - offset[1], x + offset[0]);
        checkMove(y - offset[1], x - offset[0]);
        break;
      }
      default:
        break;
    }
  });
  return moves;
};

class Board extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      promote: { x: 8, y: 8 }
    };
  }
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  handlePromotePawn = choice => {
    const { promote } = this.state;
    const newField = JSON.parse(JSON.stringify(this.props.field));
    newField[promote.y][promote.x].name = choice;
    newField[promote.y][promote.x].directions = directions[choice];
    this.props.changeField(newField);
    this.closeModal();
  };
  handleSquareClick = ({ y, x }) => {
    const { focus, field, moves } = this.props;
    // set focus
    if (
      (!focus || field[y][x]) &&
      (field[y][x] && field[y][x].color === this.props.player)
    ) {
      if (!focus || field[y][x] !== field[focus.y][focus.x]) {
        this.props.changeFocus({ focus: { y, x } });
        this.props.changeMoves(possibleDirections(field, { y, x }));
      } else {
        this.props.changeFocus({ focus: false });
        this.props.changeMoves([]);
      }
      // }
    } else if (
      focus &&
      (!field[y][x] || field[y][x].color !== this.props.player)
    ) {
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
                    x: x,
                    y: y
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
        this.props.changeFocus({ focus: false });
        this.props.changePlayer(this.props.player === black ? white : black);
        this.props.changeMoves([]);
        this.props.changeField(grid);
      }
    }
  };
  renderField = () => {
    const size = 8;
    let board = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      const {
        field,
        focus: { x, y },
        moves
      } = this.props;
      for (let j = 0; j < size; j++) {
        let piece = "";
        let color = "";
        if (field[i][j]) {
          piece = <Piece color={field[i][j].color} name={field[i][j].name} />;
        }
        if (i === y && j === x && field[i][j]) color = red;
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
        <div>Turn: {this.props.player}</div>
        <div className="Board">
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            contentLabel="Piece Modal"
            style={customStyles}
          >
            <PromoteForm handlePromotePawn={this.handlePromotePawn} />
          </Modal>
          {this.renderField()}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  field: getField(state),
  focus: getFocus(state),
  moves: getMoves(state),
  player: getPlayer(state)
});

export default connect(
  mapStateToProps,
  { changeField, changeFocus, changeMoves, changePlayer }
)(Board);
