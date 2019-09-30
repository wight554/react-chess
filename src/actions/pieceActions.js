import { CHANGE_FOCUS, CHANGE_MOVES } from "../constants/actions";

export const pieceActions = {
  changeFocus: function(focus) {
    return {
      type: CHANGE_FOCUS,
      focus
    };
  },
  changeMoves: function(moves) {
    return {
      type: CHANGE_MOVES,
      moves
    };
  }
};
