import userData from "../data/userData";
import roomsData from "../data/rooms";
import { messTypes } from "../_constants";
import { StatusType } from "types";
import { ShipType } from "data/games";

export const createRegMess = (name: string, index: number, error?: string) =>
  JSON.stringify({
    type: messTypes.REG,
    data: JSON.stringify({
      name,
      index,
      error: Boolean(error),
      errorText: error || "",
      id: 0,
    }),
  });

export const createWinnersUpdateMess = () =>
  JSON.stringify({
    type: messTypes.WINNERS_UPDATE,
    data: JSON.stringify(userData.winners),
    id: 0,
  });

export const creatGameCreateMess = (idGame: number, idPlayer: number) =>
  JSON.stringify({
    type: messTypes.CREATE_GAME,
    data: JSON.stringify({
      idGame,
      idPlayer,
    }),
    id: 0,
  });

export const createUpdateRoomMess = () =>
  JSON.stringify({
    type: messTypes.ROOM_UPDATE,
    data: JSON.stringify(roomsData.rooms),
    id: 0,
  });

export const createStartGameMess = (
  ships: ShipType[],
  currentPlayerIndex: number
) =>
  JSON.stringify({
    type: messTypes.START_GAME,
    data: JSON.stringify({
      ships,
      currentPlayerIndex,
    }),
    id: 0,
  });

export const createAttackMess = (
  position: { x: number; y: number },
  status: StatusType,
  currentPlayer: number
) =>
  JSON.stringify({
    type: messTypes.ATTACK,
    data: JSON.stringify({
      position,
      status,
      currentPlayer,
    }),
    id: 0,
  });

export const createTurnMess = (currentPlayer: number) =>
  JSON.stringify({
    type: messTypes.TURN,
    data: JSON.stringify({
      currentPlayer,
    }),
    id: 0,
  });

export const createFinishGameMess = (winPlayer: number) =>
  JSON.stringify({
    type: messTypes.GAME_FINISH,
    data: JSON.stringify({ winPlayer }),
    id: 0,
  });
