export const top = "top";
export const bottom = "bottom";
export const left = "left";
export const right = "right";
export const topLeft = "topLeft";
export const topRight = "topRight";
export const bottomLeft = "bottomLeft";
export const bottomRight = "bottomRight";
export const knightL = "knightL";

export const directions = {
  rook: [top, bottom, left, right],
  knight: [knightL],
  king: [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight],
  queen: [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight],
  whitePawn: [top, topLeft, topRight],
  blackPawn: [bottom, bottomLeft, bottomRight],
  bishop: [topLeft, topRight, bottomLeft, bottomRight]
};
