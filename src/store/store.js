import { createStore, combineReducers } from "redux";
import {
  check,
  field,
  focus,
  moves,
  player,
  initialCheckState,
  initialFieldState,
  initialFocusState,
  initialMovesState,
  initialPlayerState
} from "../reducers";

const initialStoreState = {
  check: initialCheckState,
  field: initialFieldState,
  focus: initialFocusState,
  moves: initialMovesState,
  player: initialPlayerState
};

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
