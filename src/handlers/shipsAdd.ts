import { GameBoard, ShipType } from "../data/games";
import { sendStartGameMess, sendTurnMess } from "../services/messages";

export const shipsAdd = (game: GameBoard, data: string) => {
  const { indexPlayer, ships } = JSON.parse(data) as {
    ships: ShipType[];
    indexPlayer: number;
  };

  game.addShips(indexPlayer, ships);
  if (game.players.every((player) => player.ready)) {
    // start the game
    game.players.forEach((player) => {
      sendStartGameMess(player.ws, player.ships, game.getPlayerIdx(player));
    });

    // send shot order
    game.players.forEach(({ ws }) => {
      sendTurnMess(ws, game.currentTurn);
    });
  }
};
