import {
  CHANGE_FOCUS,
  CHANGE_MOVES,
  CHANGE_PROMOTE
} from "../constants/actions";

export const pieceActions = {
  changeFocus: focus => {
    return {
      type: CHANGE_FOCUS,
      focus
    };
  },
  changeMoves: moves => {
    return {
      type: CHANGE_MOVES,
      moves
    };
  },
  changePromote: promote => {
    return {
      type: CHANGE_PROMOTE,
      promote
    };
  }
};
