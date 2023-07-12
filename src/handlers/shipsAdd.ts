import { GameBoard, ShipType, games } from "../data/games";
import { WsWithId } from "../..";
import { CommandType } from "types";
import { messTypes } from "../_constants";
import { attack } from "./atttack";

export const shipsAdd = (ws: WsWithId, data: string) => {
  console.log("ships data: ", JSON.parse(data)); //
  const { gameId, indexPlayer, ships } = JSON.parse(data) as {
    gameId: number;
    ships: ShipType[];
    indexPlayer: number;
  };

  let game: GameBoard | undefined;
  if ((game = games.find((game) => game.gameId === gameId))) {
    game.addShips(indexPlayer, ships);
    if (game.players.every((player) => player.ready)) {
      // start the game
      game.players.forEach((player) => {
        player.ws.send(
          JSON.stringify({
            type: messTypes.START_GAME,
            data: JSON.stringify({
              ships: player.ships,
              currentPlayerIndex: game!.getPlayerIdx(player),
            }),
          })
        );
      });

      // send shot order
      game.players.forEach((player) => {
        player.ws.send(
          JSON.stringify({
            type: messTypes.TURN,
            data: JSON.stringify({
              currentPlayer: game?.currentTurn,
            }),
          })
        );

        // handle attacks
        player.ws.on("message", (mess) => {
          const command = JSON.parse(mess.toString()) as CommandType;
          console.log(command);
          switch (command.type) {
            case messTypes.ATTACK:
              attack(game!, ws, command.data);
              break;
          }
        });
      });
    }
  }
};

// const answer: (playerId: number) => CommandType = (playerId) => ({
//   type: messTypes.START_GAME,
//   data: JSON.stringify({
//     ships: game?.getPlayerWithId(playerId),
//   }),
// });
