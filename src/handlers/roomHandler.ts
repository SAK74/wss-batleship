import roomsData from "../data/rooms";
import { CommandType } from "types";
import { WsWithId, sendToAll } from "../..";
import userData, { UserType } from "../data/userData";

export const createRoom = (ws: WsWithId) => {
  let user: UserType | undefined;
  if ((user = userData.users.find((us) => us.id === ws.id))) {
    roomsData.createRoom(user.name, user.id);
  }
  const answer: CommandType = {
    type: "update_room",
    data: JSON.stringify(roomsData.rooms),
  };
  sendToAll(JSON.stringify(answer));
};
