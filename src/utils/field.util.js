import {
  black,
  white,
  bishop,
  king,
  knight,
  pawn,
  queen,
  rook,
  directions
} from "../constants";

export function generateField() {
  const field = [];
  const size = 8;
  for (let i = 0; i < size; i++) {
    let color;
    if (i > 1) color = white;
    else color = black;
    field.push([]);
    switch (i) {
      case 0:
      case 7:
        for (let j = 0; j < size; j++) {
          switch (j) {
            case 0:
            case 7:
              field[i][j] = {
                name: rook,
                color,
                directions: directions[rook]
              };
              break;
            case 1:
            case 6:
              field[i][j] = {
                name: knight,
                color,
                directions: directions[knight]
              };
              break;
            case 2:
            case 5:
              field[i][j] = {
                name: bishop,
                color,
                directions: directions[bishop]
              };
              break;
            case 3:
              field[i][j] = {
                name: queen,
                color,
                directions: directions[queen]
              };
              break;
            case 4:
              field[i][j] = {
                name: king,
                color,
                directions: directions[king]
              };
              break;
            default:
              break;
          }
        }
        break;
      case 1:
      case 6:
        for (let j = 0; j < size; j++) {
          field[i].push({
            name: pawn,
            color,
            firstStep: true,
            directions: directions[`${color}Pawn`]
          });
        }
        break;
      default:
        for (let j = 0; j < size; j++) field[i].push(null);
    }
  }
  return field;
}
