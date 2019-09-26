import { CHANGE_MOVES } from "../constants";

export const initialMovesState = [];

export const moves = (state = initialMovesState, action) => {
  switch (action.type) {
    case CHANGE_MOVES:
      return action.moves;
    default:
      return state;
  }
};
