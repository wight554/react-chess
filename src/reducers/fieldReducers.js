import { CHANGE_FIELD, initialFieldState } from "../constants/actions";

export const fieldReducers = {
  field: (state = initialFieldState, action) => {
    switch (action.type) {
      case CHANGE_FIELD:
        return action.field;
      default:
        return state;
    }
  }
};
