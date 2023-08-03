import { BOARD_SIZE } from "../_constants";
import { WsWithId } from "../..";
import usersData from "../data/userData";
import { StatusType } from "types";
import {
  sendAttackMess,
  sendTurnMess,
  sendFinishGameMess,
} from "../services/messages";

export interface ShipType {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface PlayerType {
  ships: ShipType[];
  ready: boolean;
  ws: WsWithId;
  shots: { x: number; y: number }[];
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

  addShips(idx: number, ships: ShipType[]) {
    this.players[idx] = {
      ...this.players[idx],
      ships,
      ready: true,
    };
  }

  addPlayer(ws: WsWithId) {
    this.players.push({
      ships: [],
      ready: false,
      ws,
      shots: [],
    });
  }

  getPlayerIdx(player: PlayerType) {
    return this.players.indexOf(player);
  }

  currentTurn = 1;
  changeCurrentTurn() {
    this.currentTurn = 1 - this.currentTurn;
    return this.currentTurn;
  }

  randomAttack() {
    let rndShot: { x: number; y: number };
    do {
      rndShot = getRandomShot();
    } while (
      this.players[this.currentTurn].shots.some(
        (el) => el.x === rndShot.x && el.y === rndShot.y
      )
    );
    this.attack(rndShot.x, rndShot.y);
  }

  attack(x: number, y: number) {
    if (
      this.players[this.currentTurn].shots.some(
        (el) => el.x === x && el.y === y
      )
    ) {
      return;
    }
    this.players[this.currentTurn].shots.push({ x, y });
    let status: StatusType = "miss";
    this.players[1 - this.currentTurn].ships.forEach((ship, shipIdx) => {
      for (let piece = 0; piece < ship.length; piece += 1) {
        const pieceX = ship.position.x + (ship.direction ? 0 : piece);
        const pieceY = ship.position.y + (ship.direction ? piece : 0);
        if (pieceX === x && pieceY === y) {
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
              this.sendKilledStatusForShip(ship, shipIdx);
              return;
            default:
          }
          break;
        }
      }
    });
    // send attack mess
    if (status === "miss" || status === "shot") {
      this.players.forEach(({ ws }) => {
        sendAttackMess(ws, { x, y }, status, this.currentTurn);
      });
      // sent turn mess
      if (status === "miss") {
        const currentPlayer = this.changeCurrentTurn();
        this.players.forEach(({ ws }) => {
          sendTurnMess(ws, currentPlayer);
        });
      }
    }
  }

  private sendKilledStatusForShip(ship: ShipType, shipIdx: number) {
    for (let piece = 0; piece < ship.length; piece += 1) {
      const pieceX = ship.position.x + (ship.direction ? 0 : piece);
      const pieceY = ship.position.y + (ship.direction ? piece : 0);
      this.players.forEach(({ ws }) => {
        sendAttackMess(
          ws,
          { x: pieceX, y: pieceY },
          "killed",
          this.currentTurn
        );
      });
    }
    // send status 'miss' for all around
    this.sendMissStatusAround(ship);
    const playerUnderShot = this.players[1 - this.currentTurn];
    playerUnderShot.ships.splice(shipIdx, 1);
    if (!playerUnderShot.ships.length) {
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
    squares.forEach(({ x, y }) => {
      const shots = this.players[this.currentTurn].shots;
      if (
        !this.players[this.currentTurn].shots.some(
          (el) => el.x === x && el.y === y
        )
      ) {
        shots.push({ x, y });
      }
      this.players.forEach(({ ws }) => {
        sendAttackMess(ws, { x, y }, "miss", this.currentTurn);
      });
    });
  }

  private finishGame() {
    this.players.forEach(({ ws }) => {
      sendFinishGameMess(ws, this.currentTurn);
    });
    const winnerId = this.players[this.currentTurn].ws.id;
    usersData.updateWinner(winnerId);
    games = games.filter((g) => g.gameId !== this.gameId);
  }
}

let games: GameBoard[] = [];

const getRandomShot = () => ({
  x: Math.round(Math.random() * (BOARD_SIZE - 1)),
  y: Math.round(Math.random() * (BOARD_SIZE - 1)),
});
