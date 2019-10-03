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
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
    </Provider>
  );
}
