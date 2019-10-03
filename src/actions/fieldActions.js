import {
  CHANGE_FIELD,
  CHANGE_HISTORY,
  CHANGE_HISTORY_STEP
} from "../constants/actions";

export const fieldActions = {
  changeField: field => {
    return {
      type: CHANGE_FIELD,
      field
    };
  },
  changeHistory: history => {
    return {
      type: CHANGE_HISTORY,
      history
    };
  },
  changeHistoryStep: historyStep => {
    return {
      type: CHANGE_HISTORY_STEP,
      historyStep
    };
  }
};
