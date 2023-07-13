import { CommandType } from "types";
import userData, { UserType } from "../data/userData";
import { WsWithId } from "../..";
import roomsData from "../data/rooms";
import { messTypes } from "../_constants";

export function logHandler(data: CommandType["data"], ws: WsWithId) {
  const user = JSON.parse(data) as UserType;
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
    type: messTypes.ROOM_UPDATE,
    data: JSON.stringify(roomsData.rooms),
  };
  ws.send(JSON.stringify(rooms));
  ws.send(
    JSON.stringify({
      type: messTypes.WINNERS_UPDATE,
      data: JSON.stringify(userData.winners),
    })
  );
}
