import { GameBoard, games } from "../data/games";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { messTypes } from "../_constants";

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
  game.addPlayer(0, ws);
  // game.gamePlayersWs.push(ws);

  const firstPlayer = clients.find(
    (client) => client.id === room.roomUsers[0].index
  );
  let firstWs: WsWithId | undefined;
  if ((firstWs = clients.find((cl) => cl.id === firstPlayer?.id))) {
    game.addPlayer(1, firstWs);
    // game.gamePlayersWs.push(firstWs);
  }
  // game.gamePlayers.push(clients.find(client=>client.id===firstPlayer?.id))
  games.push(new GameBoard());
  const answer = (id: number) => ({
    type: messTypes.CREATE_GAME,
    data: JSON.stringify({
      idGame: game.gameId,
      idPlayer: id,
    }),
  });
  game.players.forEach((player) => {
    player.ws.send(JSON.stringify(answer(player.id)));
  });
  const newRooms = roomsData.deleteRoom(roomIndex);
  const roomUpdate: CommandType = {
    type: messTypes.ROOM_UPDATE,
    data: JSON.stringify(newRooms),
  };
  sendToAll(JSON.stringify(roomUpdate));
};
