import { BOARD_SIZE, messTypes } from "../_constants";
import { WsWithId } from "../..";
import usersData from "../data/userData";

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
  shipsAmount: number;
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
      shipsAmount: ships.length,
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
      shipsAmount: 0,
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
    this.currentTurn = 1 - this.currentTurn;
    return this.currentTurn;
  }

  getShotStatus(x: number, y: number) {
    console.log("shot to : ", x, y, 1 - this.currentTurn);
    let status = "miss";
    this.players[1 - this.currentTurn].ships.forEach((ship, shipIdx) => {
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
              this.sendKilledStatusForShip(ship);
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

  private sendKilledStatusForShip(ship: ShipType) {
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
              currentPlayer: this.currentTurn,
            }),
          })
        );
      });
    }
    // send status 'miss' for all around
    this.sendMissStatusAround(ship);
    this.players[1 - this.currentTurn].shipsAmount -= 1;
    if (!this.players[1 - this.currentTurn].shipsAmount) {
      this.finishGame();
    }
  }

  private sendMissStatusAround(ship: ShipType) {
    const squares: { x: number; y: number }[] = [];
    function pushIfExist(x: number, y: number) {
      if (x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE) {
        squares.push({ x, y });
      }
    }
    let prevX = ship.position.x,
      prevY = ship.position.y;
    if (ship.direction) {
      for (let i = -1; i < 2; i += 1) {
        pushIfExist(prevX + i, prevY - 1);
        pushIfExist(prevX + i, prevY + ship.length);
      }
    } else {
      for (let i = -1; i < 2; i += 1) {
        pushIfExist(prevX - 1, prevY + i);
        pushIfExist(prevX + ship.length, prevY + i);
      }
    }
    for (let i = 0; i < ship.length; i += 1) {
      const posX = ship.direction ? prevX : prevX + i;
      const posY = ship.direction ? prevY + i : prevY;
      for (let i = -1; i < 2; i += 2) {
        ship.direction
          ? pushIfExist(posX + i, posY)
          : pushIfExist(posX, posY + i);
      }
    }
    this.players.forEach((player) => {
      squares.forEach(({ x, y }) => {
        player.ws.send(
          JSON.stringify({
            type: messTypes.ATTACK,
            data: JSON.stringify({
              position: {
                x,
                y,
              },
              status: "miss",
              currentPlayer: this.currentTurn,
            }),
          })
        );
      });
    });
  }

  private finishGame() {
    this.players.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: "finish",
          data: JSON.stringify({
            winPlayer: this.currentTurn,
          }),
        })
      );
    });
    const winnerId = this.players[this.currentTurn].ws.id;
    usersData.updateWinner(winnerId);
  }
}

export const games: GameBoard[] = [];
