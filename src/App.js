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

  console.log("users get rendered");

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

function UserItem() {
  const conn = React.useContext(ConnContext);

  console.log("user get rendered");

  const userQuery = `
  [:find ?name .
   :in $ ?email
   :where
   [?u "user/email" ?email]
   [?u "user/name"  ?name]
  ]`;

  const johnDoe = useBind(conn, userQuery, "john.doe@gmail.com");

  console.log("Single User");

  return (
    <div>
      <h1> Single User</h1>
      {johnDoe}
    </div>
  );
}

function NavBar() {
  const conn = React.useContext(ConnContext);
  const authUserQuery = `
   [:find (pull ?user [*]) .
    :where
    [?ui "ui/auth-user" ?user]
  ]
  `;

  const authUser = useBind(conn, authUserQuery);

  console.log("Auth user", authUser);
  return <nav>Auth User: {authUser["user/email"]} </nav>;
}

function App() {
  return (
    <div className="App">
      <NavBar />
      <h1> Users: </h1>
      <UsersList />
      <UserItem />
    </div>
  );
}

export default App;
