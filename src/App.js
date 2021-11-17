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
const tweetsQuery = `
  [:find [(pull ?tweet [* {"tweet/author" [*]}]) ...]
  :where
  [?tweet "tweet/title"]
  ]
`;

const tweetQuery = `
  [:find (pull ?tweet [* {"tweet/author" [*]}]) .
  :in $ ?tid
  :where
  [?tweet "tweet/id" ?tid]
  [?tweet "tweet/title"]
  ]
`;
const tweetIdsQuery = `
  [:find [?tid ...]
   :where [?tweet "tweet/id" ?tid]]
`;

const tweetLikesCountQuery = ` 
  [:find (count ?user) .
   :in $ ?tweet-id
   :where
   [?tweet "tweet/id" ?tweet-id]
   [?tweet "tweet/likes" ?user]
  ]
`;

const tweetRepliesCountQuery = ` 
  [:find (count ?user) .
   :in $ ?tweet-id
   :where
   [?tweet "tweet/id" ?tweet-id]
   [?tweet "tweet/replies" ?user]
  ]
`;

const tweetRetweetsCountQuery = ` 
  [:find (count ?user) .
   :in $ ?tweet-id
   :where
   [?tweet "tweet/id" ?tweet-id]
   [?tweet "tweet/retweets" ?user]
  ]
`;

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

function addTweet(event, tweet, updateTweet, authEmail, conn) {
  event.preventDefault();
  console.log("tweet", tweet);
  // const ui = datascript.q(ui_query_2, datascript.db(conn));
  // const authEmail = ui["ui/auth-user"]["user/email"];
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
  const authUser = useBind(conn, authUserQuery);
  const userAvatar = authUser["user/avatar"];
  const userEmail = authUser["user/email"];

  const initState = "";
  const [tweetInput, updateTweet] = useState(initState);

  const handleChange = (event) => updateTweet(event.target.value);

  return (
    <div>
      <form
        onSubmit={(event) =>
          addTweet(event, tweetInput, updateTweet, userEmail, conn)
        }
      >
        <input
          value={tweetInput}
          placeholder="Whats happening?"
          onChange={handleChange}
        />
        <button type="submit"> Tweet</button>
      </form>
    </div>
  );
}

function likeTweet(tweetId, email, conn) {
  const updatedTweet = [
    {
      "tweet/id": tweetId,
      "tweet/likes": ["user/email", email],
    },
  ];

  datascript.transact(conn, updatedTweet);
}
function replyTweet(tweetId, email, conn) {
  const updatedTweet = [
    {
      "tweet/id": tweetId,
      "tweet/replies": ["user/email", email],
    },
  ];

  datascript.transact(conn, updatedTweet);
}

function reTweet(tweetId, email, conn) {
  const updatedTweet = [
    {
      "tweet/id": tweetId,
      "tweet/retweets": ["user/email", email],
    },
  ];

  datascript.transact(conn, updatedTweet);
}

function TweetItem({ tweetId }) {
  const conn = useContext(ConnContext);
  const tweet = useBind(conn, tweetQuery, tweetId);
  const tweetTitle = tweet["tweet/title"];
  const user = tweet["tweet/author"];
  const tweetAuthor = user["user/name"];
  const tweetHandle = user["user/handle"];
  const displayUrl = user["user/avatar"];

  // Auth User
  const authUser = useBind(conn, authUserQuery);
  const authUserEmail = authUser["user/email"];

  // Tweet Likes count
  const tweetReplies = useBind(conn, tweetRepliesCountQuery, tweetId);
  const tweetRetweets = useBind(conn, tweetRetweetsCountQuery, tweetId);
  const tweetLikes = useBind(conn, tweetLikesCountQuery, tweetId);

  console.log("tweetLikes", tweetLikes);

  console.log("displayUrl", displayUrl);
  return (
    <li className={"tweetItem"} key={tweet["tweet/id"]}>
      <div className="tweetPic">
        <img className="tweetImg" src={displayUrl} alt={tweetAuthor} />
      </div>
      <div className="tweetDetails">
        <div className={"tweetAuthorAndHandle"}>
          <p className="tweetAuthor">{tweetAuthor}</p>
          <p className="tweetHandle">{tweetHandle}</p>
        </div>

        <p className="tweetTitle">{tweetTitle}</p>
        <div className="tweetButtons">
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={() => replyTweet(tweetId, authUserEmail, conn)}>
              Reply
            </button>
            <p>{tweetReplies}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={() => reTweet(tweetId, authUserEmail, conn)}>
              Retweet
            </button>
            <p>{tweetRetweets}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={() => likeTweet(tweetId, authUserEmail, conn)}>
              Like
            </button>
            <p>{tweetLikes}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

function Tweets() {
  const conn = useContext(ConnContext);

  const tweets = useBind(conn, tweetsQuery);

  const tweetIds = useBind(conn, tweetIdsQuery);

  console.log("tweets", tweets);

  return (
    <div>
      <h1> Tweets</h1>
      <TweetInput />

      <div>
        <ul>
          {tweetIds.map((tweetId) => {
            return <TweetItem key={tweetId} tweetId={tweetId} />;
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
        <Tweets />
      </div>
    </div>
  );
}

export default App;
