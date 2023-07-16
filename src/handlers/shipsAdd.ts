import { GameBoard, ShipType } from "../data/games";
import { createStartGameMess, createTurnMess } from "../services/messages";

export const shipsAdd = (game: GameBoard, data: string) => {
  const { indexPlayer, ships } = JSON.parse(data) as {
    ships: ShipType[];
    indexPlayer: number;
  };

  game.addShips(indexPlayer, ships);
  if (game.players.every((player) => player.ready)) {
    // start the game
    game.players.forEach((player) => {
      player.ws.send(
        createStartGameMess(player.ships, game.getPlayerIdx(player))
      );
    });

    // send shot order
    game.players.forEach((player) => {
      player.ws.send(createTurnMess(game.currentTurn));
    });
  }
};
