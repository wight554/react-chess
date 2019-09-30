import { CHANGE_FIELD } from "../constants";

export const fieldActions = {
  changeField: function(field) {
    return {
      type: CHANGE_FIELD,
      field
    };
  }
};
