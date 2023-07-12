import { GameBoard, games } from "../data/games";
import { WsWithId } from "../..";
import { messTypes } from "../_constants";

export const attack = (game: GameBoard, ws: WsWithId, data: string) => {
  const { x, y, indexPlayer } = JSON.parse(data) as {
    x: number;
    y: number;
    // gameId:number;
    indexPlayer: 0 | 1;
  };
  // const status =
  // const opponentIdx = game.players.findIndex((player) => player.id !== ws.id);
  // console.log(game.players[opponentIdx])
  if (indexPlayer !== game.currentTurn) {
    return;
  }

  // get shots status
  const status = game.getShotStatus(x, y);
  game.players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: messTypes.ATTACK,
        data: JSON.stringify({
          position: {
            x,
            y,
          },
          status,
          currentPlayer: indexPlayer,
        }),
      })
    );
    // player.ws.send(
    //   JSON.stringify({
    //     type: messTypes.TURN,
    //     data: JSON.stringify({ currentPlayer: game.changeCurrentTurn() }), // has changed twice!!!
    //   })
    // );
  });

  // conditional switch a turn
  if (status === "miss") {
    const currentPlayer = game.changeCurrentTurn();
    game.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: messTypes.TURN,
          data: JSON.stringify({ currentPlayer }), // has changed twice!!!
        })
      );
    });
  }

  // ws.send(
  //   JSON.stringify({
  //     type: messTypes.ATTACK,
  //     data: JSON.stringify({
  //       position: {
  //         x,
  //         y,
  //       },
  //       status: "killed",
  //       currentPlayer: ws.id,
  //     }),
  //   })
  // );
};
