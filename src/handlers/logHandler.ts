import { CommandType } from "types";
import { WebSocket } from "ws";
import userData, { UserType } from "../data/userData";
import { WsWithName } from "../..";

export function logHandler(data: CommandType["data"], ws: WsWithName) {
  // console.log("handler: ", ws);
  const user = JSON.parse(data) as UserType;
  ws.name = user.name;
  console.log("data: ", user);
  const { name, id } = userData.addUser(user);
  const answer: CommandType = {
    type: "reg",
    data: JSON.stringify({
      name,
      index: id,
      error: false,
    }),
  };
  ws.send(JSON.stringify(answer));
}
