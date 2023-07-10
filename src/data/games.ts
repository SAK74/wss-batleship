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

// const rows = Array(10).fill(false);
// const a = Array(10).fill(rows);
// const cell = a[2][3];

interface PlayerType {
  id: number;
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

  addShips(playerIdx: number, ships: ShipType[]) {
    const idx = this.players.findIndex((player) => player.id === playerIdx);
    this.players[idx] = {
      // id: this.players[idx].id,
      ...this.players[idx],
      ships,
      ready: true,
    };
  }

  addPlayer(idx: number, ws: WsWithId) {
    this.players[idx] = {
      id: ws.id,
      ships: [],
      ready: false,
      ws,
      // board: Array(10).fill(Array(10).fill(false)),
    };
    // this.gamePlayersWs.push(ws);
    if (idx === 1) {
      this.currentTurn = ws.id;
    }
  }

  getPlayerWithId(id: number) {
    const idx = this.players.findIndex((player) => player.id === id);
    return this.players[idx];
  }

  // private fillBoard(board: PlayerType["board"], ships: ShipType[]) {
  //   ships.forEach(({ position: { x, y }, direction, length }) => {
  //     board[y][x] = true;
  //     for (let i = 1; i < length; i += 1) {
  //       direction ? (board[y + 1][x] = true) : (board[y][x + i] = true);
  //     }
  //   });
  // }

  currentTurn?: number;
  changeCurrentTurn() {
    this.currentTurn =
      this.currentTurn === this.players[0].id
        ? this.players[1].id
        : this.players[0].id;
    return this.currentTurn;
  }
}

export const games: GameBoard[] = [];
