import { messTypes } from "../_constants";
import { WsWithId } from "../..";

export interface ShipType {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

// interface BoardType{

// }

interface PlayerType {
  // id: number;
  ships: ShipType[];
  ready: boolean;
  ws: WsWithId;
  // board: boolean[][]; //
}

export class GameBoard {
  gameId: number;
  constructor() {
    do {
      this.gameId = Math.round(Math.random() * 100);
    } while (games.find((game) => game.gameId === this.gameId));

    games.push(this);
  }
  players: PlayerType[] = [];

  // gamePlayersWs: WsWithId[] = [];

  addShips(idx: number, ships: ShipType[]) {
    // const idx = this.players.findIndex((player) => player.id === playerIdx);
    this.players[idx] = {
      // id: this.players[idx].id,
      ...this.players[idx],
      ships,
      ready: true,
    };
  }

  addPlayer(ws: WsWithId) {
    // this.players[idx] = {
    //   id: ws.id,
    //   ships: [],
    //   ready: false,
    //   ws,
    //   // board: Array(10).fill(Array(10).fill(false)),
    // };
    // this.gamePlayersWs.push(ws);
    this.players.push({
      ships: [],
      ready: false,
      ws,
    });
    // if (idx === 1) {
    //   this.currentTurn = ws.id;
    // }
  }

  // getPlayerWithId(id: number) {
  //   const idx = this.players.findIndex((player) => player.id === id);
  //   return this.players[idx];
  // }

  getPlayerIdx(player: PlayerType) {
    return this.players.indexOf(player);
  }

  // private fillBoard(board: PlayerType["board"], ships: ShipType[]) {
  //   ships.forEach(({ position: { x, y }, direction, length }) => {
  //     board[y][x] = true;
  //     for (let i = 1; i < length; i += 1) {
  //       direction ? (board[y + 1][x] = true) : (board[y][x + i] = true);
  //     }
  //   });
  // }

  currentTurn = 1;
  changeCurrentTurn() {
    // this.currentTurn =
    //   this.currentTurn === this.players[0].id
    //     ? this.players[1].id
    //     : this.players[0].id;
    this.currentTurn = this.currentTurn === 0 ? 1 : 0;
    return this.currentTurn;
  }

  getShotStatus(x: number, y: number, playerIdx: number) {
    console.log("shot to : ", x, y, playerIdx);
    let status = "miss";
    this.players[1 - playerIdx].ships.forEach((ship, shipIdx) => {
      for (let piece = 0; piece < ship.length; piece += 1) {
        const pieceX = ship.position.x + (ship.direction ? 0 : piece);
        const pieceY = ship.position.y + (ship.direction ? piece : 0);
        if (pieceX === x && pieceY === y) {
          // return true;
          // console.log(shipIdx, ship.type);
          status = "shot";
          switch (ship.type) {
            case "huge":
              ship.type = "large";
              break;
            case "large":
              ship.type = "medium";
              break;
            case "medium":
              ship.type = "small";
              break;
            case "small":
              status = "killed";
              // do send status to 'killed' for all pieces,
              this.sendKilledStatusForShip(ship, playerIdx);
              // do set status 'miss' for all around
              break;
            default:
          }
          break;
        }
      }
    });
    return status;
    // this.players.forEach((player) => {
    //   player.ws.send(
    //     JSON.stringify({
    //       type: messTypes.ATTACK,
    //       data: JSON.stringify({
    //         position: {
    //           x,
    //           y,
    //         },
    //         status,
    //         currentPlayer: 1-playerIdx,
    //       }),
    //     })
    //   );
    // });
  }

  private sendKilledStatusForShip(ship: ShipType, currentPlayer: number) {
    // const shipLength = this.players[playerIdx].ships[shipIdx].length;
    for (let piece = 0; piece < ship.length; piece += 1) {
      const pieceX = ship.position.x + (ship.direction ? 0 : piece);
      const pieceY = ship.position.y + (ship.direction ? piece : 0);
      this.players.forEach((player) => {
        player.ws.send(
          JSON.stringify({
            type: messTypes.ATTACK,
            data: JSON.stringify({
              position: {
                x: pieceX,
                y: pieceY,
              },
              status: "killed",
              currentPlayer,
            }),
          })
        );
      });
    }
    // for ()
  }
}

export const games: GameBoard[] = [];
