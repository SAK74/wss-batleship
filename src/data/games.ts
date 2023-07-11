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
}

export const games: GameBoard[] = [];
