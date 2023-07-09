import { WsWithId } from "../..";

interface ShipType {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

interface PlayerType {
  id: number;
  ships: ShipType[];
}

export class GameBoard {
  gameId: number;
  constructor() {
    do {
      this.gameId = Math.round(Math.random() * 100);
    } while (games.find((game) => game.gameId === this.gameId));
    games.push(this);
  }

  player1?: PlayerType;
  player2?: PlayerType;

  gamePlayers: WsWithId[] = [];

  addShips(playerIdx: number, ships: ShipType[]) {
    // this.ships.push(ship)
  }
  addPlayer() {}
}

export const games: GameBoard[] = [];
