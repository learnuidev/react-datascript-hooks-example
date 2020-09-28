import datascript from "datascript";
import { random_uuid } from "../utils";

export function populate(conn) {
  const users = [
    {
      "user/name": "John Doe",
      "user/email": "john.doe@gmail.com",
    },
    {
      "user/name": "Mo Salah",
      "user/email": "mo@gmail.com",
    },
    {
      "user/name": "Rabindranath Tagore",
      "user/email": "rabin.tagore@gmail.com",
    },
    {
      "user/name": "Will Shakesphere",
      "user/email": "will.shakesphere@gmail.com",
    },
  ];
  datascript.transact(conn, users);

  const authUser = [
    {
      "ui/id": random_uuid(),
      "ui/auth-user": ["user/email", "john.doe@gmail.com"],
    },
  ];

  datascript.transact(conn, authUser);
}
