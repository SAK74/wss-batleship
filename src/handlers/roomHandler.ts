import { WebSocket } from "ws";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { WsWithId, sendToAll } from "../..";
import userData, { UserType } from "../data/userData";

export const createRoom = (ws: WsWithId) => {
  // console.log(ws)
  let user: UserType | undefined;
  if ((user = userData.users.find((us) => us.id === ws.id))) {
    roomsData.createRoom(user.name, user.id);
  }
  const answer: CommandType = {
    type: "update_room",
    data: JSON.stringify(roomsData.rooms),
  };
  // console.log("rooms: ", roomsData.rooms);
  // ws.send(JSON.stringify(answer));
  sendToAll(JSON.stringify(answer));
};
