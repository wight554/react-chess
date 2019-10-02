import {
  CHANGE_PLAYER,
  CHANGE_WINNER,
  initialPlayerState,
  initialWinnerState
} from "../constants/actions";

export const playerReducers = {
  player: (state = initialPlayerState, action) => {
    switch (action.type) {
      case CHANGE_PLAYER:
        return action.player;
      default:
        return state;
    }
  },
  winner: (state = initialWinnerState, action) => {
    switch (action.type) {
      case CHANGE_WINNER:
        return action.winner;
      default:
        return state;
    }
  }
};
