import { CHANGE_FIELD, CHANGE_HISTORY } from "../constants/actions";

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
  }
};
