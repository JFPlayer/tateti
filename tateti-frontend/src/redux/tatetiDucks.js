import { io } from "socket.io-client";

// types
const SET_PIN = "SET_PIN";
const CONNECT_SOCKET = "CONNECT_SOCKET";
const CREATE_MATCH = "CREATE_MATCH";
const JOIN_MATCH = "JOIN_MATCH";
const SET_NAME = "SET_NAME";
const SET_OPONENT = "SET_OPONENT";
const SELECTED_FIELD = 'SELECTED_FIELD';
const GAME_OVER = 'GAME_OVER';
const TRY_AGAIN = 'TRY_AGAIN';
const SET_SCORE = 'SET_SCORE';
const USER_DISCONNECTED = 'USER_DISCONNECTED';
const NO_WINNER = 'NO_WINNER';

//constantes
const initialState = {
  socket: null,
  myName: "",
  oponent: "",
  winner: "",
  noWinner: false,
  PIN: "",
  joinMatch: false,
  symbol: "",
  myTurn: true,
  scores: {
    me: 0,
    oponent: 0,
  },
  match: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// reducer
export default function tatetiReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CONNECT_SOCKET:
      return {
        ...state,
        socket: payload,
      };
    case SET_PIN:
      return {
        ...state,
        PIN: payload,
      };
    case CREATE_MATCH:
      return {
        ...state,
        symbol: 1,
        joinMatch: false,
      };
    case SET_NAME:
      return {
        ...state,
        myName: payload,
      };
    case SET_OPONENT:
      return {
        ...state,
        oponent: payload,
      };
    case JOIN_MATCH:
      return {
        ...state,
        PIN: payload,
        joinMatch: true,
        symbol: 2,
      };
    case SELECTED_FIELD:
      return {
        ...state,
        match: payload,
        myTurn: !state.myTurn,
      };
    case GAME_OVER:
      return {
        ...state,
        winner: payload,
      };
    case NO_WINNER:
      return {
        ...state,
        noWinner: true,
      };
    case USER_DISCONNECTED:
      return {
        ...state,
        winner: "",
        oponent: "",
        symbol: 1,
        joinMatch: false,
        myTurn: true,
        scores: {
          me: 0,
          oponent: 0,
        },
        match: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    case SET_SCORE:
      return {
        ...state,
        scores: payload,
      };
    case TRY_AGAIN:
      return {
        ...state,
        winner: "",
        noWinner: "",
        match: [0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    default:
      return state;
  }
}

//acciones

export const connectSocket = () => {
  const socket = io();
  return {
    type: "CONNECT_SOCKET",
    payload: socket,
  };
};
