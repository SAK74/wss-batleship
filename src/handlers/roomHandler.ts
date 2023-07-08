import { WebSocket } from "ws";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { WsWithName, sendToAll } from "../..";

export const createRoom = (ws: WsWithName) => {
  // console.log(ws)
  roomsData.createRoom(ws.name);
  const answer: CommandType = {
    type: "update_room",
    data: JSON.stringify(roomsData.rooms),
  };
  console.log("rooms: ", roomsData.rooms);
  // ws.send(JSON.stringify(answer));
  sendToAll(JSON.stringify(answer));
};
