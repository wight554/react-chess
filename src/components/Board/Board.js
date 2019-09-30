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
  getPieceBeatableMoves,
  getKingInfo,
  checkCheck,
  getSavableMoves,
  getSaviors,
  getOppositeDirection
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
  handlePromotePawn = choice => {
    const { promote } = this.state;
    const { field, changeField, changeCheck, player } = this.props;
    const newField = JSON.parse(JSON.stringify(field));
    newField[promote.y][promote.x].name = choice;
    newField[promote.y][promote.x].directions = piecesDirections[choice];
    changeField(newField);
    let kingInfo = getKingInfo(
      getPlayerPieces(newField, getOpponentColor(player))
    );
    let checked = checkCheck(newField, player);
    // if check check happened after move, it's checkmate
    if (!checked) {
      kingInfo = getKingInfo(getPlayerPieces(newField, player));
      checked = checkCheck(newField, getOpponentColor(player));
    }
    if (checked) {
      const saviors = getSaviors(newField, player);
      // if there are cells that can be covered
      if (saviors.length) {
        this.setSaviors(saviors);
      } else {
        // checkmate
        this.endGame(getOpponentColor(kingInfo.color));
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
          const savableMoves = getSavableMoves(field, getOpponentColor(player));
          if (savior === king) {
            let kingBeatMove = false;
            for (let i = 0; i < saviorMoves.length; i++) {
              if (saviorMoves[i].beatable) {
                kingBeatMove = saviorMoves[i];
              }
            }
            let newMoves = saviorMoves.filter(
              o =>
                !savableMoves.some(
                  o2 => (o.x === o2.x && o.y === o2.y) || o.route === o2.route
                )
            );
            // it would be harder to hide from figures higher than pawn
            if (savableMoves[savableMoves.length - 1].name !== pawn) {
              const checkerMoves = getPieceMoves(
                field,
                savableMoves[savableMoves.length - 1]
              );
              newMoves = newMoves.filter(
                o =>
                  !checkerMoves.some(o2 => {
                    if (kingBeatMove) return o.route === o2.route;
                    return o.x === o2.x && o.y === o2.y;
                  })
              );
            }
            if (kingBeatMove) newMoves.push(kingBeatMove);
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
        changePlayer(getOpponentColor(player));
        changeField(grid);
        let kingInfo = getKingInfo(
          getPlayerPieces(grid, getOpponentColor(player))
        );
        let checked = checkCheck(grid, player);
        // if check check happened after move, it's checkmate
        if (!checked) {
          kingInfo = getKingInfo(getPlayerPieces(grid, player));
          checked = checkCheck(grid, getOpponentColor(player));
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
            this.endGame(getOpponentColor(kingInfo.color));
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
