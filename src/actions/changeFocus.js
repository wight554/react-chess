import { CHANGE_FOCUS } from '../constants';

export function changeFocus({focus}) {
    return {
      type: CHANGE_FOCUS,
      focus
    }
}