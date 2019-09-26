import { CHANGE_MOVES } from "../constants";

export function changeMoves(moves) {
  return {
    type: CHANGE_MOVES,
    moves
  };
}
