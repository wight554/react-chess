import { createStore, combineReducers } from 'redux';
import { field, focus, initialFieldState, initialFocusState } from '../reducers';

const initialStoreState = {
  field: initialFieldState,
  focus: initialFocusState
};

const store = createStore(
  combineReducers({
    field,
    focus
  }),
  initialStoreState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

