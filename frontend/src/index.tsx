import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Store } from "redux";
import { Provider } from "react-redux";

import App from "./app";
import * as serviceWorker from "./serviceWorker";
import { configureStore, IApplicationState } from "./redux/store";
import { getConfig } from "./lib/functions";
import './scss/_index.scss';

const BASE_PATH: string = getConfig("BASE_PATH");
const store: Store<IApplicationState> = configureStore();

ReactDOM.render(
  <BrowserRouter basename={BASE_PATH}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.register();
