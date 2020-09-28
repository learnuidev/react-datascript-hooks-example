import React from "react";
import "./App.css";
import ConnContext from "./db/ConnContext";
import datascript from "datascript";
import useBind from "./db/useBind";

function populate(conn) {
  const data = [
    {
      "user/name": "Jane Doe",
      "user/email": "jane.doe@gmail.com",
    },
  ];
  datascript.transact(conn, data);
}

function UsersList() {
  const conn = React.useContext(ConnContext);
  const usersQuery = `
  [:find [?user ...]
   :where [?u "user/name" ?user]]`;

  // console.log("users get rendered");

  const users = useBind(conn, usersQuery);
  return (
    <div>
      <ul>
        {users &&
          users.map((user) => {
            return <li key={user}>{user}</li>;
          })}
      </ul>
      <button onClick={() => populate(conn)}>Add more</button>
    </div>
  );
}

function TweetInput() {
  return (
    <form>
      <input />
      <button> Tweet</button>
    </form>
  );
}

function Tweets() {
  const conn = React.useContext(ConnContext);

  // console.log("user get rendered");

  const userQuery = `
  [:find ?name .
   :in $ ?email
   :where
   [?u "user/email" ?email]
   [?u "user/name"  ?name]
  ]`;

  const johnDoe = useBind(conn, userQuery, "john.doe@gmail.com");

  // console.log("Single User");

  return (
    <div>
      <h1> Tweets</h1>
      <TweetInput />
      {johnDoe}
    </div>
  );
}

function changeAuthUser(email, conn) {
  console.log("email", email);
  const query = `[:find ?uid .
    :where
    [?uid "ui/id"]
   ]
  `;
  const uid = datascript.q(query, datascript.db(conn));
  console.log("uid", uid);
  const authUser = [[":db/add", uid, "ui/auth-user", ["user/email", email]]];
  datascript.transact(conn, authUser);
}

function NavBar() {
  const conn = React.useContext(ConnContext);
  const authUserQuery = `
   [:find (pull ?user ["user/email"]) .
    :where
    [?ui "ui/auth-user" ?user]
  ]
  `;
  const authUser = useBind(conn, authUserQuery);

  const usersQuery = `
  [:find [(pull ?user ["user/email" "user/name"]) ...]
   :where [?user "user/name"]]`;

  const users = useBind(conn, usersQuery);

  console.log("Auth user", users);
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p>Auth User: {authUser["user/email"]}</p>
      <select
        value={authUser["user/email"]}
        onChange={(event) => changeAuthUser(event.target.value, conn)}
      >
        {users.map((user) => {
          return (
            <option key={user["user/email"]} value={user["user/email"]}>
              {user["user/name"]}
            </option>
          );
        })}
      </select>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <div className="App-inner">
        <NavBar />
        <h1> Users: </h1>
        <UsersList />
        <Tweets />
      </div>
    </div>
  );
}

export default App;
