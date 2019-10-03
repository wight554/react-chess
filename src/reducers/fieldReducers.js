import {
  CHANGE_FIELD,
  CHANGE_HISTORY,
  CHANGE_HISTORY_STEP,
  initialFieldState,
  initialHistoryState,
  initialHistoryStepState
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
  },
  historyStep: (state = initialHistoryStepState, action) => {
    switch (action.type) {
      case CHANGE_HISTORY_STEP:
        return action.historyStep;
      default:
        return state;
    }
  }
};
