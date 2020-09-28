import { useEffect, useState } from "react";
import datascript from "datascript";
import deepEqual from "deep-equal";
import { uuidv4 } from "../utils";

function useBind(conn, query, ...args) {
  const queryArgs = [query, datascript.db(conn), ...args];
  const [state, updateState] = useState(() => datascript.q(...queryArgs));

  const id = uuidv4();

  useEffect(() => {
    datascript.listen(conn, id, function (data) {
      if (data.tx_data.length) {
        const updatedQueryArgs = [query, data.db_after, ...args];
        const updatedState = datascript.q(...updatedQueryArgs);

        if (!deepEqual(state, updatedState)) {
          updateState(updatedState);
        }
      }
    });
    return () => {
      return datascript.unlisten(conn);
    };
  }, [conn, query, args, id, state]);

  return state;
}

export default useBind;
