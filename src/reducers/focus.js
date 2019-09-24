import { CHANGE_FOCUS } from '../constants';

export const initialFocusState = false;

export const focus = (state = initialFocusState, action) => {
  switch (action.type) {
    case CHANGE_FOCUS:
      return action.focus
    default:
      return state
  }
}