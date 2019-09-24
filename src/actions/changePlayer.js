import { CHANGE_PLAYER } from '../constants';

export function changePlayer(player) {
    return {
      type: CHANGE_PLAYER,
      player
    }
}
