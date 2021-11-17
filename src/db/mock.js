import datascript from "datascript";
import { random_uuid } from "../utils";

export function populate(conn) {
  const users = [
    {
      "user/name": "Sarah D",
      "entity/type": "type/user",
      "user/email": "john.doe@gmail.com",
      "user/handle": "@john.doe",
      "user/avatar": "https://tylermcginnis.com/would-you-rather/sarah.jpg",
    },
    {
      "user/name": "Dan A.",
      "entity/type": "type/user",
      "user/handle": "@magic.mo",
      "user/email": "mo@gmail.com",
      "user/avatar": "https://tylermcginnis.com/would-you-rather/dan.jpg",
    },
    {
      "user/name": "Tyler M",
      "entity/type": "type/user",
      "user/handle": "@mr.rabindranath",
      "user/email": "rabin.tagore@gmail.com",
      "user/avatar": "https://tylermcginnis.com/would-you-rather/tyler.jpg",
    },
    {
      "user/name": "Will Shakesphere",
      "entity/type": "type/user",
      "user/handle": "@coolwhiz.will",
      "user/email": "will.shakesphere@gmail.com",
      "user/avatar": "https://tylermcginnis.com/would-you-rather/dan.jpg",
    },
  ];
  datascript.transact(conn, users);

  const tweets = [
    {
      "tweet/id": random_uuid(),
      "entity/type": "type/tweet",
      "tweet/title": "Hello world",
      "tweet/author": ["user/email", "john.doe@gmail.com"],
    },
    {
      "tweet/id": random_uuid(),
      "entity/type": "type/tweet",
      "tweet/title": "What a win against Arsenal",
      "tweet/author": ["user/email", "mo@gmail.com"],
    },
  ];

  datascript.transact(conn, tweets);

  const authUser = [
    {
      "ui/id": random_uuid(),
      "entity/type": "type/ui",
      "ui/auth-user": ["user/email", "john.doe@gmail.com"],
    },
  ];

  datascript.transact(conn, authUser);
}
