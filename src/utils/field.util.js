import { directions, piecesDirections, pieces, colors } from "../constants";

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
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].x === x && moves[i].y === y) {
      return true;
    }
  }
  return false;
};

export const checkPromote = (moves, { x, y }) => {
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].x === x && moves[i].y === y && moves[i].promote) {
      return true;
    }
  }
  return false;
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
            if (field[y][x]) {
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
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j]) {
        if (field[i][j].color === color) {
          pieces.push({ ...field[i][j], x: j, y: i });
        }
      }
    }
  }
  return pieces;
};

export const getAllPlayerMoves = (field, pieces) => {
  const allMoves = [];
  for (let i = 0; i < pieces.length; i++) {
    const directions = possibleDirections(field, {
      x: pieces[i].x,
      y: pieces[i].y,
      mover: pieces[i].name
    });
    if (directions.length) allMoves.push(directions);
  }
  return allMoves;
};

export const getPieceMoves = (field, piece) => {
  return possibleDirections(field, piece);
};

export const getPieceBeatableMoves = moves => {
  const beatableMoves = [];
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].beatable) beatableMoves.push(moves[i]);
  }
  return beatableMoves;
};

export const getBeatableMoves = moves => {
  const beatableMoves = [];
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j] && moves[i][j].beatable) beatableMoves.push(moves[i][j]);
    }
  }
  return beatableMoves;
};

export const getKingInfo = playerPieces => {
  for (let i = 0; i < playerPieces.length; i++) {
    if (playerPieces[i].name === king) {
      return playerPieces[i];
    }
  }
  // return false if no info
  return false;
};

export const checkPieceInBeatableMoves = ({ y, x }, moves) => {
  for (let i = 0; i < moves.length; i++) {
    if (y === moves[i].y && x === moves[i].x) return true;
  }
  return false;
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
  for (let i = 0; i < beatableMoves.length; i++) {
    if (beatableMoves[i].piece === king) {
      const kingBeatRoute = beatableMoves[i].route;
      const beaterMoves = getPieceMoves(field, beatableMoves[i].mover);
      for (let j = 0; j < beaterMoves.length; j++) {
        // push coverable cells
        if (
          !beaterMoves[j].beatable &&
          // can't cover knight (FIXME)
          beaterMoves[j].route !== knightL &&
          beaterMoves[j].route === kingBeatRoute
        ) {
          beaterSavableMoves.push(beaterMoves[j]);
        }
      }
      // beater can be beated as well
      beaterSavableMoves.push(beatableMoves[i].mover);
    }
  }
  return beaterSavableMoves;
};

export const getSaviors = (field, player) => {
  const saviors = [];
  const beaterSavableMoves = getSavableMoves(field, player);
  const ownMoves = getAllPlayerMoves(
    field,
    getPlayerPieces(field, getOpponentColor(player))
  );
  for (let i = 0; i < ownMoves.length; i++) {
    for (let j = 0; j < ownMoves[i].length; j++) {
      for (let k = 0; k < beaterSavableMoves.length; k++) {
        if (
          beaterSavableMoves[k].name === knight &&
          ownMoves[i][j].mover.name === king
        ) {
          saviors.push(ownMoves[i][j].mover);
        }
        if (
          ownMoves[i][j].x === beaterSavableMoves[k].x &&
          ownMoves[i][j].y === beaterSavableMoves[k].y
        ) {
          saviors.push(ownMoves[i][j].mover);
        }
      }
    }
  }
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
