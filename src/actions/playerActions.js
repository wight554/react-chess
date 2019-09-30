import { CHANGE_PLAYER, CHANGE_CHECK } from "../constants";

export const playerActions = {
  changePlayer: function(player) {
    return {
      type: CHANGE_PLAYER,
      player
    };
  },
  changeCheck: function(check) {
    return {
      type: CHANGE_CHECK,
      check
    };
  }
};
