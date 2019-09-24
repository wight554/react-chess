import { generateField } from '../utils'
import { CHANGE_FIELD } from '../constants';

export const initialFieldState = generateField();

export const field = (state = initialFieldState, action) => {
  switch (action.type) {
    case CHANGE_FIELD:
      return action.field
    default:
      return state
  }
}