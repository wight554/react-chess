import { generateField } from "../../utils";
import { colors } from "../";
const { white } = colors;

export const initialCheckState = "";
export const initialFieldState = generateField();
export const initialHistoryState = [
  { player: white, fieldState: initialFieldState }
];
export const initialHistoryStepState = 0;
export const initialFocusState = false;
export const initialMovesState = [];
export const initialPlayerState = white;
export const initialPromoteState = {};
export const initialSaviorsState = [];
export const initialWinnerState = "";
