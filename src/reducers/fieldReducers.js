import {
  CHANGE_FIELD,
  CHANGE_HISTORY,
  initialFieldState,
  initialHistoryState
} from "../constants/actions";

export const fieldReducers = {
  field: (state = initialFieldState, action) => {
    switch (action.type) {
      case CHANGE_FIELD:
        return action.field;
      default:
        return state;
    }
  },
  history: (state = initialHistoryState, action) => {
    switch (action.type) {
      case CHANGE_HISTORY:
        return action.history;
      default:
        return state;
    }
  }
};
