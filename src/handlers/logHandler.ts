import { CommandType } from "types";
import userData, { UserType } from "../data/userData";
import { WsWithId, clients, sendToAll } from "../..";
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

    // remove user from rooms & ws collection after close
    ws.on("close", () => {
      console.log(`ws ${ws.id} was closed`);
      const wsIdx = clients.findIndex(({ id }) => id === ws.id);
      clients.splice(wsIdx, 1);
      roomsData.deletePlayersRoom(ws.id);
      sendToAll(createUpdateRoomMess());
    });
  }
}
