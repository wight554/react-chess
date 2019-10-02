import { CHANGE_PLAYER, CHANGE_WINNER } from "../constants/actions";

export const playerActions = {
  changePlayer: player => {
    return {
      type: CHANGE_PLAYER,
      player
    };
  },
  changeWinner: winner => {
    return {
      type: CHANGE_WINNER,
      winner
    };
  }
};
