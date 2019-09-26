import { CHANGE_FIELD } from "../constants";

export function changeField(field) {
  return {
    type: CHANGE_FIELD,
    field
  };
}
