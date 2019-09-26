import { createStore, combineReducers } from "redux";
import {
  field,
  focus,
  moves,
  player,
  initialFieldState,
  initialFocusState,
  initialMovesState,
  initialPlayerState
} from "../reducers";

const initialStoreState = {
  field: initialFieldState,
  focus: initialFocusState,
  moves: initialMovesState,
  player: initialPlayerState
};

const store = createStore(
  combineReducers({
    field,
    focus,
    moves,
    player
  }),
  initialStoreState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
