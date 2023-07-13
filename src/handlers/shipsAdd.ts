import { GameBoard, ShipType } from "../data/games";
import { messTypes } from "../_constants";

export const shipsAdd = (game: GameBoard, data: string) => {
  console.log("ships data: ", JSON.parse(data)); //
  const { indexPlayer, ships } = JSON.parse(data) as {
    ships: ShipType[];
    indexPlayer: number;
  };

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
    });
  }
};
