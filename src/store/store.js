import { createStore, combineReducers } from 'redux';
import { field, focus, player, initialFieldState, initialFocusState, initialPlayerState } from '../reducers';

const initialStoreState = {
  field: initialFieldState,
  focus: initialFocusState,
  player: initialPlayerState
};

const store = createStore(
  combineReducers({
    field,
    focus,
    player
  }),
  initialStoreState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

