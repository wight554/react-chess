import {
  CHANGE_FOCUS,
  CHANGE_MOVES,
  CHANGE_PROMOTE,
  initialFocusState,
  initialMovesState,
  initialPromoteState
} from "../constants/actions";

export const pieceReducers = {
  focus: (state = initialFocusState, action) => {
    switch (action.type) {
      case CHANGE_FOCUS:
        return action.focus;
      default:
        return state;
    }
  },
  moves: (state = initialMovesState, action) => {
    switch (action.type) {
      case CHANGE_MOVES:
        return action.moves;
      default:
        return state;
    }
  },
  promote: (state = initialPromoteState, action) => {
    switch (action.type) {
      case CHANGE_PROMOTE:
        return action.promote;
      default:
        return state;
    }
  }
};
