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
  const _err = userData.verify(user);
  if (_err) {
    ws.send(createRegMess(user.name, user.id, _err));
  } else {
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
}
