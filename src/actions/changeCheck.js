import { CHANGE_CHECK } from "../constants";

export function changeCheck(check) {
  return {
    type: CHANGE_CHECK,
    check
  };
}
