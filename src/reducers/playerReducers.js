import {
  CHANGE_CHECK,
  CHANGE_PLAYER,
  initialCheckState,
  initialPlayerState
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
  check: (state = initialCheckState, action) => {
    switch (action.type) {
      case CHANGE_CHECK:
        return action.check;
      default:
        return state;
    }
  }
};
