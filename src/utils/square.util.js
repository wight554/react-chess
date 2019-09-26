import { darkGrey, lightGrey } from "../constants";

export function getCellColor({ x, y, color }) {
  if (color) return color;
  if ((x % 2 === 1 && y % 2 === 1) || (x % 2 === 0 && y % 2 === 0))
    return darkGrey;
  return lightGrey;
}

export function getFilterColor({ x, y, color }) {
  if (color) return color;
  if ((x % 2 === 1 && y % 2 === 1) || (x % 2 === 0 && y % 2 === 0))
    return darkGrey;
  return lightGrey;
}
