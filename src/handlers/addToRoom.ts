import { GameBoard } from "../data/games";
import { WsWithId, sendToAll } from "../..";
import roomsData from "../data/rooms";
import { CommandType } from "types";
import { messTypes } from "../_constants";
import { shipsAdd } from "./shipsAdd";

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
  if (firstPlayerWs && firstPlayerWs.id !== ws.id) {
    game.addPlayer(firstPlayerWs);
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
      player.ws.on("message", (mess) => {
        const command = JSON.parse(mess.toString()) as CommandType;
        console.log(command);
        switch (command.type) {
          case messTypes.SHIPS_ADD:
            shipsAdd(game, command.data);
            break;
          case messTypes.ATTACK:
            const { x, y } = JSON.parse(command.data) as {
              x: number;
              y: number;
            };
            game.attack(x, y);
            break;
          case messTypes.RANDOM_ATTACK:
            game.randomAttack();
            break;
        }
      });
    });

    // delete all users rooms
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
