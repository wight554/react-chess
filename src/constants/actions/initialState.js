import { generateField } from "../../utils";
import { colors } from "../";
const { white } = colors;

export const initialCheckState = false;
export const initialFieldState = generateField();
export const initialFocusState = false;
export const initialMovesState = [];
export const initialPlayerState = white;
