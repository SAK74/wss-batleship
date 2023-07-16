import userData from "../data/userData";
import roomsData from "../data/rooms";
import { messTypes } from "../_constants";
import { StatusType } from "types";
import { ShipType } from "data/games";
import { WsWithId } from "../..";

export const sendRegMess = (
  ws: WsWithId,
  name: string,
  index: number,
  error?: string
) => {
  ws.send(
    JSON.stringify({
      type: messTypes.REG,
      data: JSON.stringify({
        name,
        index,
        error: Boolean(error),
        errorText: error || "",
        id: 0,
      }),
    })
  );
  console.log("-> " + messTypes.REG);
};

export const createWinnersUpdateMess = () =>
  JSON.stringify({
    type: messTypes.WINNERS_UPDATE,
    data: JSON.stringify(userData.winners),
    id: 0,
  });

export const createUpdateRoomMess = () =>
  JSON.stringify({
    type: messTypes.ROOM_UPDATE,
    data: JSON.stringify(roomsData.rooms),
    id: 0,
  });

export const sendGameCreateMess = (
  ws: WsWithId,
  idGame: number,
  idPlayer: number
) => {
  ws.send(
    JSON.stringify({
      type: messTypes.CREATE_GAME,
      data: JSON.stringify({
        idGame,
        idPlayer,
      }),
      id: 0,
    })
  );
  console.log("-> " + messTypes.CREATE_GAME);
};

export const sendStartGameMess = (
  ws: WsWithId,
  ships: ShipType[],
  currentPlayerIndex: number
) => {
  ws.send(
    JSON.stringify({
      type: messTypes.START_GAME,
      data: JSON.stringify({
        ships,
        currentPlayerIndex,
      }),
      id: 0,
    })
  );
  console.log("-> " + messTypes.START_GAME);
};

export const sendAttackMess = (
  ws: WsWithId,
  position: { x: number; y: number },
  status: StatusType,
  currentPlayer: number
) => {
  ws.send(
    JSON.stringify({
      type: messTypes.ATTACK,
      data: JSON.stringify({
        position,
        status,
        currentPlayer,
      }),
      id: 0,
    })
  );
  console.log("-> " + messTypes.ATTACK);
};

export const sendTurnMess = (ws: WsWithId, currentPlayer: number) => {
  ws.send(
    JSON.stringify({
      type: messTypes.TURN,
      data: JSON.stringify({
        currentPlayer,
      }),
      id: 0,
    })
  );
  console.log("-> " + messTypes.TURN);
};

export const sendFinishGameMess = (ws: WsWithId, winPlayer: number) => {
  ws.send(
    JSON.stringify({
      type: messTypes.GAME_FINISH,
      data: JSON.stringify({ winPlayer }),
      id: 0,
    })
  );
  console.log("-> " + messTypes.GAME_FINISH);
};
