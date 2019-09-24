import React, { Component } from 'react';
import {connect} from 'react-redux';
import BoardRow from '../BoardRow';
import Piece from '../Piece';
import Square from '../Square';
import { changeField, changeFocus, changePlayer } from '../../actions'
import { getField, getFocus, getPlayer } from '../../selectors'
import './Board.css'

class Board extends Component {
  handleSquareClick = ({y,x}) => {
    const {focus, field} = this.props;
    if(!focus && field[y][x] && field[y][x].color === this.props.player)
      this.props.changeFocus({focus: {y,x}})
    else if(focus && field[y][x] === field[focus.y][focus.x]) {
      this.props.changeFocus({focus: false})
    }
    else if(focus && !field[y][x]) {
        const grid = [...field].map((row, rIdx) => {  
            if (rIdx === y) {
                row = row.map((cell, cIdx) => {
                    if (cIdx === x) {
                        const piece = field[focus.y][focus.x];
                        if(piece.color !== this.props.player) {
                            return cell;
                        }
                        // movement logic
                        switch(field[focus.y][focus.x].name) {
                            case 'rook':
                                if(y === focus.y || x === focus.x)
                                    cell = piece
                                break;
                            case 'pawn':
                                    const step = piece.firstStep ? 2 : 1;
                                    if(((y === focus.y+step && piece.color === 'black')
                                      || (y === focus.y-step && piece.color === 'white')
                                      || y === focus.y) && x === focus.x) {
                                      cell = piece
                                      if(piece.firstStep)
                                        cell.firstStep = false;
                                    }
                                    break;
                            case 'king':
                                    if((y === focus.y-1 || y === focus.y+1 || y === focus.y)
                                    && (x === focus.x-1 || x === focus.x+1 || x === focus.x))
                                        cell = piece
                                    break;
                            default:
                                cell = piece
                        }
                    }
                    return cell;
                }); 
            }
            return row;
        });
        if(grid[y][x]){
          if((x !== focus.x || y !== focus.y))
              grid[focus.y][focus.x] = null;
          this.props.changeFocus({focus: false})
          this.props.changePlayer(this.props.player === 'black' ? 'white' : 'black')
          this.props.changeField(grid)
        }
    }
  }
  renderField = () => {
    const size = 8;
    let board = [];
    for (let i = 0; i < size; i++){
        let row = [];
        const {field, focus: {x,y}} = this.props;
        for (let j = 0; j < size; j++){
            let cellFocus = false;
            let piece = '';
            if(field[i][j]) piece = <Piece color={field[i][j].color} name={field[i][j].name}/>
            if(i === y && j === x && field[i][j]) cellFocus = true
            row.push(<Square x={j} y={i} key={`x-${j} y-${i}`} focus={cellFocus} handleSquareClick={this.handleSquareClick}>{piece}</Square>)
        }
        board[i] = <BoardRow y={i} key={`y-${i}`}>{row}</BoardRow>
    }
    return board;
  }
  render() {
    return (
      <div className="Board">
        {this.renderField()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    field: getField(state),
    focus: getFocus(state),
    player: getPlayer(state)
});


export default connect (mapStateToProps, { changeField, changeFocus, changePlayer })(Board);
