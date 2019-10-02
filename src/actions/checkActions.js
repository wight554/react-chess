import { CHANGE_CHECK, CHANGE_SAVIORS } from "../constants/actions";

export const checkActions = {
  changeCheck: check => {
    return {
      type: CHANGE_CHECK,
      check
    };
  },
  changeSaviors: saviors => {
    return {
      type: CHANGE_SAVIORS,
      saviors
    };
  }
};
