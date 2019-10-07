import React from "react";
import { Provider } from "react-redux";
import Desk from "../Desk";
import store from "../../store";
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Desk />
      </div>
    </Provider>
  );
}
