import { GameBoard, games } from "../data/games";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { types } from "../_constants";

interface AddToRoom {
  indexRoom: number;
}

// const games = [];

export const addUserToRoom = (
  ws: WsWithId,
  data: CommandType["data"],
  clients: WsWithId[]
) => {
  const roomIndex = (JSON.parse(data) as AddToRoom).indexRoom;
  const room = roomsData.rooms[roomIndex];
  const game = new GameBoard();
  game.gamePlayers.push(ws);
  const firstPlayer = clients.find(
    (client) => client.id === room.roomUsers[0].index
  );
  let firstWs: WsWithId | undefined;
  if ((firstWs = clients.find((cl) => cl.id === firstPlayer?.id))) {
    game.gamePlayers.push(firstWs);
  }
  // game.gamePlayers.push(clients.find(client=>client.id===firstPlayer?.id))
  games.push(new GameBoard());
  const answer = (id: number) => ({
    type: types.CREATE_GAME,
    data: JSON.stringify({
      idGame: game.gameId,
      idPlayer: id,
    }),
  });
  game.gamePlayers.forEach((player) => {
    player.send(JSON.stringify(answer(player.id)));
  });
  const newRooms = roomsData.deleteRoom(roomIndex);
  const roomUpdate: CommandType = {
    type: types.ROOM_UPDATE,
    data: JSON.stringify(newRooms),
  };
  sendToAll(JSON.stringify(roomUpdate));
};
