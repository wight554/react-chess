import { createStore, combineReducers } from "redux";
import {
  checkReducers,
  fieldReducers,
  pieceReducers,
  playerReducers
} from "../reducers";
import {
  initialCheckState,
  initialFieldState,
  initialFocusState,
  initialHistoryState,
  initialHistoryStepState,
  initialMovesState,
  initialPlayerState,
  initialPromoteState,
  initialSaviorsState,
  initialWinnerState
} from "../constants/actions";

const initialStoreState = {
  check: initialCheckState,
  field: initialFieldState,
  focus: initialFocusState,
  history: initialHistoryState,
  historyStep: initialHistoryStepState,
  moves: initialMovesState,
  player: initialPlayerState,
  promote: initialPromoteState,
  saviors: initialSaviorsState,
  winner: initialWinnerState
};

const { check, saviors } = checkReducers;
const { field, history, historyStep } = fieldReducers;
const { focus, moves, promote } = pieceReducers;
const { player, winner } = playerReducers;

const store = createStore(
  combineReducers({
    check,
    field,
    focus,
    history,
    historyStep,
    moves,
    player,
    promote,
    saviors,
    winner
  }),
  initialStoreState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
