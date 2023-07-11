import { GameBoard } from "../data/games";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { messTypes } from "../_constants";

// interface AddToRoom {
//   indexRoom: number;
// }

// const games = [];

export const addUserToRoom = (
  ws: WsWithId,
  data: CommandType["data"],
  clients: WsWithId[]
) => {
  const roomIndex = (
    JSON.parse(data) as {
      indexRoom: number;
    }
  ).indexRoom;
  const room = roomsData.rooms[roomIndex];
  const game = new GameBoard();
  game.addPlayer(ws);

  const firstPlayerWs = clients.find(
    (client) => client.id === room.roomUsers[0].index
  );
  // let firstWs: WsWithId | undefined;
  if (firstPlayerWs && firstPlayerWs.id !== ws.id) {
    game.addPlayer(firstPlayerWs);
    // game.gamePlayersWs.push(firstWs);

    // game.gamePlayers.push(clients.find(client=>client.id===firstPlayer?.id))
    // games.push(game);
    // const answer = (idx: number) => ({
    //   type: messTypes.CREATE_GAME,
    //   data: JSON.stringify({
    //     idGame: game.gameId,
    //     idPlayer: game.getPlayerIdx(),
    //   }),
    // });
    game.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: messTypes.CREATE_GAME,
          data: JSON.stringify({
            idGame: game.gameId,
            idPlayer: game.getPlayerIdx(player),
          }),
        })
      );
    });

    const newRooms = roomsData
      .deletePlayersRoom(ws.id)
      .deletePlayersRoom(firstPlayerWs.id).rooms;
    const roomUpdate: CommandType = {
      type: messTypes.ROOM_UPDATE,
      data: JSON.stringify(newRooms),
    };
    sendToAll(JSON.stringify(roomUpdate));
  }
};
