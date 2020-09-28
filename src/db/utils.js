import datascript from "datascript";

export function createConn(schema) {
  return datascript.create_conn(schema);
}
