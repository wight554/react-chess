import { CHANGE_PLAYER } from "../constants";

export const initialPlayerState = "white";

export const player = (state = initialPlayerState, action) => {
  switch (action.type) {
    case CHANGE_PLAYER:
      return action.player;
    default:
      return state;
  }
};
