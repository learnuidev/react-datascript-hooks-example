import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ConnContext from "./db/ConnContext";
import datascript from "datascript";

// Twitter
// User Entity

const twitterUserSchema = {
  "user/email": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },

  "user/follows": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
  "ui/auth-user": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/valueType": ":db.type/ref",
  },
};

function populate(conn) {
  // const data = [[":db/add", -1, "name", "John Doe"]];
  const data = [
    {
      "user/name": "John Doe",
      "user/email": "john.doe@gmail.com",
    },
  ];
  datascript.transact(conn, data);

  const authUser = [{ "ui/auth-user": ["user/email", "john.doe@gmail.com"] }];

  datascript.transact(conn, authUser);
}

/*Create a connection to a new db instance using the schema*/
const conn = datascript.create_conn(twitterUserSchema);
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
