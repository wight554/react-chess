const top = "top";
const bottom = "bottom";
const left = "left";
const right = "right";
const topLeft = "topLeft";
const topRight = "topRight";
const bottomLeft = "bottomLeft";
const bottomRight = "bottomRight";
const knightL = "knightL";

export const directions = {
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  knightL
};

export const piecesDirections = {
  rook: [top, bottom, left, right],
  knight: [knightL],
  king: [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight],
  queen: [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight],
  whitePawn: [top, topLeft, topRight],
  blackPawn: [bottom, bottomLeft, bottomRight],
  bishop: [topLeft, topRight, bottomLeft, bottomRight]
};
