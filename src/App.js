import React, { useState, useContext } from "react";
import "./App.css";
import ConnContext from "./db/ConnContext";
import datascript from "datascript";
import useBind from "./db/useBind";
import { random_uuid } from "./utils";

// ===== RULES ======

// ====== QUERIES ======

// ====== UI ======
const ui_query = `
  [:find ?uid .
   :where
   [?uid "ui/id"]
  ]
`;

const ui_query_2 = `
  [:find (pull ?uid [* {"ui/auth-user" [*]}]) .
   :where
   [?uid "ui/id"]
  ]
`;

// ====== AUTH ======
const authUserQuery = `
   [:find (pull ?user ["user/email"]) .
    :where
    [?ui "ui/auth-user" ?user]
   ]
  `;

// ====== USERS ======
const usersQuery = `
  [:find [(pull ?user ["user/email" "user/name"]) ...]
   :where [?user "user/name"]
  ]
`;

const userQuery = `
  [:find ?name .
   :in $ ?email-or-id
   :where
    (or 
      [?u "user/email" ?email-or-id]
      [?u "user/id"    ?email-or-id])
    [?u "user/name"  ?name]
  ]`;

const userNamesQuery = `
  [:find [?user ...]
   :where
   [?u "user/name" ?user]]
`;

// ====== TWEETS ======

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
  const conn = useContext(ConnContext);
  const users = useBind(conn, userNamesQuery);
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

function addTweet(event, tweet, updateTweet, conn) {
  event.preventDefault();
  console.log("tweet", tweet);
  const ui = datascript.q(ui_query_2, datascript.db(conn));
  const authEmail = ui["ui/auth-user"]["user/email"];
  console.log("UI", authEmail);

  // const newTweet = [[":db/add", uid, "ui/auth-user", ["user/email", email]]];
  const newTweet = [
    {
      "tweet/id": random_uuid(),
      "tweet/title": tweet,
      "tweet/author": ["user/email", authEmail],
    },
  ];
  datascript.transact(conn, newTweet);
  updateTweet("");
}

function TweetInput() {
  const conn = useContext(ConnContext);

  const initState = "";
  const [tweetInput, updateTweet] = useState(initState);

  const handleChange = (event) => updateTweet(event.target.value);

  return (
    <form onSubmit={(event) => addTweet(event, tweetInput, updateTweet, conn)}>
      <input value={tweetInput} onChange={handleChange} />
      <button type="submit"> Tweet</button>
    </form>
  );
}

function Tweets() {
  const conn = useContext(ConnContext);

  // console.log("user get rendered");

  const johnDoe = useBind(conn, userQuery, "john.doe@gmail.com");

  // console.log("Single User");

  const tweetsQuery = `
    [:find [(pull ?tweet [* {"tweet/author" [*]}]) ...]
     :where
     [?tweet "tweet/title"]
    ]
  `;

  const tweets = useBind(conn, tweetsQuery);

  console.log("tweets", tweets);

  return (
    <div>
      <h1> Tweets</h1>
      <TweetInput />
      {johnDoe}
      <div>
        <ul>
          {tweets.map((tweet) => {
            const tweetTitle = tweet["tweet/title"];
            const tweetAuthor = tweet["tweet/author"]["user/name"];
            return (
              <li key={tweet["tweet/id"]}>
                {tweetTitle} - {tweetAuthor}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function changeAuthUser(email, conn) {
  console.log("email", email);

  const uid = datascript.q(ui_query, datascript.db(conn));
  console.log("uid", uid);
  const authUser = [[":db/add", uid, "ui/auth-user", ["user/email", email]]];
  datascript.transact(conn, authUser);
}

function NavBar() {
  const conn = useContext(ConnContext);
  const authUser = useBind(conn, authUserQuery);
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
