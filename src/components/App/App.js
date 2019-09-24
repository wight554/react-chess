import React, { Component } from 'react';
import {Provider} from 'react-redux';
import Board from '../Board'
import store from '../../store';
import './App.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Board/>
          <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </div>
      </Provider>
    );
  }
}

export default App;
