import { CommandType } from "types";
import { WebSocket } from "ws";
import userData, { UserType } from "../data/userData";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import { messTypes } from "../_constants";

export function logHandler(data: CommandType["data"], ws: WsWithId) {
  // console.log("handler: ", ws);
  const user = JSON.parse(data) as UserType;
  // ws.name = user.name;
  // console.log("data: ", user);
  const { name, id } = userData.addUser(user);
  ws.id = id;
  const reg: CommandType = {
    type: "reg",
    data: JSON.stringify({
      name,
      index: id,
      error: false,
    }),
  };
  ws.send(JSON.stringify(reg));
  const rooms: CommandType = {
    type: "update_room",
    data: JSON.stringify(roomsData.rooms),
  };
  console.log("rooms: ", roomsData.rooms);
  // ws.send(JSON.stringify(answer));
  // sendToAll(JSON.stringify(rooms));
  ws.send(JSON.stringify(rooms));
  ws.send(
    JSON.stringify({
      type: messTypes.WINNERS_UPDATE,
      data: JSON.stringify(userData.winners),
    })
  );
}
