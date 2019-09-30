import {
  CHANGE_FOCUS,
  CHANGE_MOVES,
  initialFocusState,
  initialMovesState
} from "../constants/actions";

export const pieceReducers = {
  moves: (state = initialMovesState, action) => {
    switch (action.type) {
      case CHANGE_MOVES:
        return action.moves;
      default:
        return state;
    }
  },
  focus: (state = initialFocusState, action) => {
    switch (action.type) {
      case CHANGE_FOCUS:
        return action.focus;
      default:
        return state;
    }
  }
};
