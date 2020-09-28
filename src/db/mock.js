import datascript from "datascript";

export function populate(conn) {
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
