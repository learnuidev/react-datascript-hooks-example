import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ConnContext from "./db/ConnContext";
import schema from "./db/schema";
import datascript from "datascript";
import { populate } from "./db/mock";

/*Create a connection to a new db instance using the schema*/
const conn = datascript.create_conn(schema);
populate(conn);

function Main() {
  return (
    <React.StrictMode>
      <ConnContext.Provider value={conn}>
        <App />
      </ConnContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
