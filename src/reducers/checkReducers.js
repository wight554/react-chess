import {
  CHANGE_CHECK,
  CHANGE_SAVIORS,
  initialCheckState,
  initialSaviorsState
} from "../constants/actions";

export const checkReducers = {
  check: (state = initialCheckState, action) => {
    switch (action.type) {
      case CHANGE_CHECK:
        return action.check;
      default:
        return state;
    }
  },
  saviors: (state = initialSaviorsState, action) => {
    switch (action.type) {
      case CHANGE_SAVIORS:
        return action.saviors;
      default:
        return state;
    }
  }
};
