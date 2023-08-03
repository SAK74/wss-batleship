import roomsData from "../data/rooms";
import { WsWithId, sendToAll } from "../..";
import userData, { UserType } from "../data/userData";
import { createUpdateRoomMess } from "../services/messages";

export const createRoom = (ws: WsWithId) => {
  let user: UserType | undefined;
  if ((user = userData.users.find((us) => us.id === ws.id))) {
    roomsData.createRoom(user.name, user.id);
  }
  sendToAll(createUpdateRoomMess());
};
