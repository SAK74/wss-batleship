import { CommandType } from "types";
import userData, { UserType } from "../data/userData";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import {
  createRegMess,
  createUpdateRoomMess,
  createWinnersUpdateMess,
} from "../services/messages";

export function logHandler(data: CommandType["data"], ws: WsWithId) {
  const user = JSON.parse(data) as UserType;
  const { name, id } = userData.addUser(user);
  ws.id = id;

  // do add user veryfication
  ws.send(createRegMess(name, id));
  ws.send(createUpdateRoomMess());
  ws.send(createWinnersUpdateMess());
  ws.on("close", () => {
    roomsData.deletePlayersRoom(ws.id);
    sendToAll(createUpdateRoomMess());
  });
}
