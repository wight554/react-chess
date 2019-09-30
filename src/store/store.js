import { createStore, combineReducers } from "redux";
import { fieldReducers, pieceReducers, playerReducers } from "../reducers";
import {
  initialCheckState,
  initialFieldState,
  initialFocusState,
  initialMovesState,
  initialPlayerState
} from "../constants/actions";

const initialStoreState = {
  check: initialCheckState,
  field: initialFieldState,
  focus: initialFocusState,
  moves: initialMovesState,
  player: initialPlayerState
};

const { field } = fieldReducers;
const { focus, moves } = pieceReducers;
const { check, player } = playerReducers;

const store = createStore(
  combineReducers({
    check,
    field,
    focus,
    moves,
    player
  }),
  initialStoreState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
