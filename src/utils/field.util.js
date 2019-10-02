import {
  directions,
  piecesDirections,
  pieces,
  colors,
  numbers,
  letters
} from "../constants";

const { king, knight, pawn } = pieces;
const { black, white } = colors;

const {
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  knightL
} = directions;

export const generateField = () => {
  const { bishop, king, knight, pawn, queen, rook } = pieces;
  const { black, white } = colors;
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
                directions: piecesDirections[rook]
              };
              break;
            case 1:
            case 6:
              field[i][j] = {
                name: knight,
                color,
                directions: piecesDirections[knight]
              };
              break;
            case 2:
            case 5:
              field[i][j] = {
                name: bishop,
                color,
                directions: piecesDirections[bishop]
              };
              break;
            case 3:
              field[i][j] = {
                name: queen,
                color,
                directions: piecesDirections[queen]
              };
              break;
            case 4:
              field[i][j] = {
                name: king,
                color,
                directions: piecesDirections[king]
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
            directions: piecesDirections[`${color}Pawn`]
          });
        }
        break;
      default:
        for (let j = 0; j < size; j++) field[i].push(null);
    }
  }
  return field;
};

export const checkCell = (moves, { x, y }) => {
  return moves.some(m => m.y === y && m.x === x);
};

export const checkPromote = (moves, { x, y }) => {
  return moves.some(m => m.y === y && m.x === x && m.promote);
};

export const possibleDirections = (field, { x, y }) => {
  const moves = [];
  const {
    name = undefined,
    color = white,
    directions = [],
    firstStep = false
  } = field[y][x];
  let maxStep = 1;
  directions.forEach(d => {
    switch (d) {
      case top: {
        if (name === pawn || name === king) {
          if (firstStep) maxStep = 2;
          else maxStep = 1;
        } else {
          maxStep = y;
        }
        for (let i = y - 1; i >= y - maxStep; i--) {
          if (!field[i]) break;
          if (!field[i][x]) {
            if (name === pawn && i === 0) {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x },
                promote: true
              });
            } else {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({
              route: d,
              y: i,
              x: x,
              beatable: true,
              piece: field[i][x].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case bottom: {
        if (name === pawn || name === king) {
          if (firstStep) maxStep = 2;
          else maxStep = 1;
        } else {
          maxStep = field.length - 1 - y;
        }
        for (let i = y + 1; i <= y + maxStep; i++) {
          if (!field[i]) break;
          if (!field[i][x]) {
            if (name === pawn && i === field.length - 1) {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x },
                promote: true
              });
            } else {
              moves.push({
                route: d,
                y: i,
                x: x,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            }
          } else if (field[i][x].color !== color && name !== pawn) {
            moves.push({
              route: d,
              y: i,
              x: x,
              beatable: true,
              piece: field[i][x].name,
              mover: { ...field[y][x], y, x }
            });
            break;
          } else break;
        }
        break;
      }
      case left: {
        if (name === king) maxStep = 1;
        else maxStep = x;
        for (let i = x - 1; i >= x - maxStep; i--) {
          if (i >= 0) {
            if (!field[y][i])
              moves.push({
                route: d,
                y: y,
                x: i,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            else if (field[y][i].color !== color) {
              moves.push({
                route: d,
                y: y,
                x: i,
                beatable: true,
                piece: field[y][i].name,
                mover: { ...field[y][x], y, x }
              });
              break;
            } else break;
          }
        }
        break;
      }
      case right: {
        if (name === king) maxStep = 1;
        else maxStep = field.length - x;
        for (let i = x + 1; i <= x + maxStep; i++) {
          if (i < field.length) {
            if (!field[y][i])
              moves.push({
                route: d,
                y: y,
                x: i,
                beatable: false,
                mover: { ...field[y][x], y, x }
              });
            else if (field[y][i].color !== color) {
              moves.push({
                route: d,
                y: y,
                x: i,
                beatable: true,
                piece: field[y][i].name,
                mover: { ...field[y][x], y, x }
              });
              break;
            } else break;
          }
        }
        break;
      }
      case topLeft: {
        if (name === king) maxStep = 1;
        else maxStep = x < y ? x : y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y - i]) break;
          if (x - i < 0) break;
          if (!field[y - i][x - i] && name !== pawn) {
            moves.push({
              route: d,
              y: y - i,
              x: x - i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          } else if (
            field[y - i][x - i] &&
            field[y - i][x - i].color !== color
          ) {
            if (name === pawn && y - i === 0) {
              moves.push({
                route: d,
                y: y - i,
                x: x - i,
                beatable: true,
                promote: true,
                piece: field[y - i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y - i,
                x: x - i,
                beatable: true,
                piece: field[y - i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case topRight: {
        if (name === king) maxStep = 1;
        else maxStep = x < y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y - i]) break;
          if (x + i >= field.length) break;
          if (!field[y - i][x + i] && name !== pawn)
            moves.push({
              route: d,
              y: y - i,
              x: x + i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y - i][x + i] && field[y - i][x + i].color !== color) {
            if (name === pawn && y - i === 0) {
              moves.push({
                route: d,
                y: y - i,
                x: x + i,
                beatable: true,
                promote: true,
                piece: field[y - i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y - i,
                x: x + i,
                beatable: true,
                piece: field[y - i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case bottomRight: {
        if (name === king) maxStep = 1;
        else maxStep = x > y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y + i]) break;
          if (!field[y + i][x + i] && name !== pawn)
            moves.push({
              route: d,
              y: y + i,
              x: x + i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y + i][x + i] && field[y + i][x + i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({
                route: d,
                y: y + i,
                x: x + i,
                beatable: true,
                promote: true,
                piece: field[y + i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y + i,
                x: x + i,
                beatable: true,
                piece: field[y + i][x + i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case bottomLeft: {
        if (name === king) maxStep = 1;
        else
          maxStep = maxStep =
            x < y ? field.length - 1 - x : field.length - 1 - y;
        for (let i = 1; i <= maxStep; i++) {
          if (!field[y + i]) break;
          if (x - i < 0) break;
          if (!field[y + i][x - i] && name !== pawn)
            moves.push({
              route: d,
              y: y + i,
              x: x - i,
              beatable: false,
              mover: { ...field[y][x], y, x }
            });
          else if (field[y + i][x - i] && field[y + i][x - i].color !== color) {
            if (name === pawn && y + i === field.length - 1) {
              moves.push({
                route: d,
                y: y + i,
                x: x - i,
                beatable: true,
                promote: true,
                piece: field[y + i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            } else {
              moves.push({
                route: d,
                y: y + i,
                x: x - i,
                beatable: true,
                piece: field[y + i][x - i].name,
                mover: { ...field[y][x], y, x }
              });
            }
            break;
          } else break;
        }
        break;
      }
      case knightL: {
        const offset = [1, 2];
        const checkMove = (y, x, pY, pX) => {
          if (field[y]) {
            if (field[y][x] && x >= 0 && x < field.length) {
              if (field[y][x].color !== color)
                moves.push({
                  route: d,
                  y,
                  x,
                  beatable: true,
                  piece: field[y][x].name,
                  mover: { ...field[pY][pX], y: pY, x: pX }
                });
            } else {
              moves.push({
                route: d,
                y,
                x,
                beatable: false,
                mover: { ...field[pY][pX], y: pY, x: pX }
              });
            }
          }
        };
        checkMove(y + offset[0], x + offset[1], y, x);
        checkMove(y + offset[0], x - offset[1], y, x);
        checkMove(y - offset[0], x - offset[1], y, x);
        checkMove(y - offset[0], x + offset[1], y, x);
        checkMove(y + offset[1], x + offset[0], y, x);
        checkMove(y + offset[1], x - offset[0], y, x);
        checkMove(y - offset[1], x + offset[0], y, x);
        checkMove(y - offset[1], x - offset[0], y, x);
        break;
      }
      default:
        break;
    }
  });
  return moves;
};

export const getOpponentColor = color => {
  return color === black ? white : black;
};

export const getPlayerPieces = (field, color) => {
  const pieces = [];
  field.forEach((r, rIdx) => {
    r.forEach((c, cIdx) => {
      if (c) {
        if (c.color === color) {
          pieces.push({ ...c, y: rIdx, x: cIdx });
        }
      }
    });
  });
  return pieces;
};

export const getPieceMoves = (field, piece) => {
  return possibleDirections(field, piece);
};

export const getAllPlayerMoves = (field, pieces) => {
  const allMoves = [];
  pieces.forEach(p => {
    const directions = getPieceMoves(field, {
      x: p.x,
      y: p.y
    });
    if (directions.length) allMoves.push(directions);
  });
  return allMoves;
};

export const getPieceBeatableMoves = moves => {
  const beatableMoves = [];
  moves.forEach(m => {
    if (m.beatable) beatableMoves.push(m);
  });
  return beatableMoves;
};

export const getBeatableMoves = moves => {
  const beatableMoves = [];
  moves.forEach(mArr => {
    mArr.forEach(m => {
      if (m && m.beatable) beatableMoves.push(m);
    });
  });
  return beatableMoves;
};

export const getKingInfo = playerPieces => {
  let kingInfo = false;
  playerPieces.forEach(p => {
    if (p.name === king) {
      kingInfo = p;
    }
  });
  return kingInfo;
};

export const checkPieceInBeatableMoves = ({ y, x }, moves) => {
  return moves.some(m => m.y === y && m.x === x);
};

export const checkCheck = (field, player) => {
  const kingInfo = getKingInfo(
    getPlayerPieces(field, getOpponentColor(player))
  );
  const opponentPieces = getPlayerPieces(field, player);
  const opponentMoves = getAllPlayerMoves(field, opponentPieces);
  const opponentBeatableMoves = getBeatableMoves(opponentMoves);
  const checked = kingInfo
    ? checkPieceInBeatableMoves(kingInfo, opponentBeatableMoves)
    : false;
  return checked;
};

export const getSavableMoves = (field, player) => {
  const beaterSavableMoves = [];
  const beatableMoves = getBeatableMoves(
    getAllPlayerMoves(field, getPlayerPieces(field, player))
  );
  beatableMoves.forEach(m => {
    if (m.piece === king) {
      const kingBeatRoute = m.route;
      const beaterMoves = getPieceMoves(field, m.mover);
      beaterMoves.forEach(m2 => {
        // push coverable cells
        if (
          !m2.beatable &&
          // can't cover knight
          m2.route !== knightL &&
          m2.route === kingBeatRoute
        ) {
          beaterSavableMoves.push(m2);
        }
      });
      // beater can be beated as well
      beaterSavableMoves.push(m.mover);
    }
  });
  return beaterSavableMoves;
};

export const getPossibleSaviors = (beaterSavableMoves, ownMoves) => {
  const saviors = [];
  if (!ownMoves.length) return saviors;
  ownMoves.forEach(mArr => {
    mArr.forEach(m => {
      beaterSavableMoves.forEach(m2 => {
        if (m2.name === knight && m.mover.name === king) {
          saviors.push(m.mover);
        }
        if (m2.y === m.y && m2.x === m.x) {
          saviors.push(m.mover);
        }
      });
    });
  });
  return saviors;
};

export const getOppositeDirection = direction => {
  switch (direction) {
    case top:
      return bottom;
    case bottom:
      return top;
    case left:
      return right;
    case right:
      return left;
    case topLeft:
      return bottomRight;
    case topRight:
      return bottomLeft;
    case bottomLeft:
      return topRight;
    case bottomRight:
      return topLeft;
    default:
      return direction;
  }
};

export const coordinatesToNotanion = ({ y, x }) => {
  let notationLetter = "";
  let notationNumber = 0;
  letters.forEach((l, lIdx) => {
    if (lIdx === x) notationLetter = l;
  });
  numbers.forEach((n, nIdx) => {
    if (nIdx === y) notationNumber = n;
  });
  return notationLetter + notationNumber;
};
