import { CHANGE_CHECK } from "../constants";

export const initialCheckState = false;

export const check = (state = initialCheckState, action) => {
  switch (action.type) {
    case CHANGE_CHECK:
      return action.check;
    default:
      return state;
  }
};
