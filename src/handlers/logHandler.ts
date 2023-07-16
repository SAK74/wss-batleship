import { CommandType } from "types";
import userData, { UserType } from "../data/userData";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import {
  sendRegMess,
  createUpdateRoomMess,
  createWinnersUpdateMess,
} from "../services/messages";

export function logHandler(data: CommandType["data"], ws: WsWithId) {
  const user = JSON.parse(data) as UserType;
  const _err = userData.verify(user);
  if (_err) {
    sendRegMess(ws, user.name, user.id, _err);
  } else {
    const { name, id } = userData.addUser(user);
    ws.id = id;
    sendRegMess(ws, name, id);
    sendToAll(createUpdateRoomMess());
    sendToAll(createWinnersUpdateMess());
    ws.on("close", () => {
      roomsData.deletePlayersRoom(ws.id);
      sendToAll(createUpdateRoomMess());
    });
  }
}
