import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./styles/Game.scss";
import Table from "../components/Table";
import ModalPIN from "../components/ModalPIN";
import ModalGameOver from "../components/ModalGameOver";

const Game = () => {
  const {
    myName,
    oponent,
    winner,
    scores,
    joinMatch,
    socket,
    myTurn,
    noWinner,
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("game-over", (name) => {
      console.log(`name: ${name}`)
      if(name === null) {
        console.log('EMPATEEEEE')
        dispatch({
          type: 'NO_WINNER'
        })
        dispatch({
          type: "GAME_OVER",
          payload: "",
        });
        return;
      }
      const newScores = scores;
      if (name === myName) {
        newScores.me = scores.me + 1;
      } else {
        newScores.oponent = scores.oponent + 1;
      }
      dispatch({
        type: "GAME_OVER",
        payload: name,
      });
      dispatch({
        type: "SET_SCORE",
        payload: newScores,
      });
    });

    socket.on('user-disconnected', () => {
      dispatch({
        type: 'USER_DISCONNECTED'
      })
    })
  }, []);

  return (
    <div className="game">
      <div className="game__players">
        <div className="game__player">
          <div className={`lineTurn blue ${myTurn ? "" : "hide"}`}></div>
          <div className="name">
            <span>{joinMatch ? oponent : myName}</span>
          </div>
        </div>
        <div className="game__player">
          <div className={`lineTurn magenta ${!myTurn ? "" : "hide"}`}></div>
          <div className="name">
            <span>{!joinMatch ? oponent : myName}</span>
          </div>
        </div>
      </div>
      <Table />
      <div className="game__score">
        <div className="game__score--title">
          <span>Scores</span>
        </div>
        <div className="game__score--values">
          <span>{joinMatch ? scores.oponent : scores.me}</span>
          <div className="line"></div>
          <span>{!joinMatch ? scores.oponent : scores.me}</span>
        </div>
      </div>
      {!oponent && <ModalPIN />}
      {(winner || noWinner) && <ModalGameOver />}
    </div>
  );
};

export default Game;
