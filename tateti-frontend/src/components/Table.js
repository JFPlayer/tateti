import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./styles/Table.scss";
import ex from "../assets/ex.svg";
import circle from "../assets/circle.svg";
const symbols = [ex, circle];

const Table = () => {
  const { match, symbol, socket, PIN, myName, myTurn, joinMatch } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("selected-field", (index, selectedSymbol, globalMatch) => {
      console.log(`${index}   ${selectedSymbol}`);
      dispatch({
        type: "SELECTED_FIELD",
        payload: globalMatch.map((s, i) => (i === index ? selectedSymbol : s)),
      });
    });
  }, []);

  const handleClick = (index) => () => {
    if (!joinMatch) {
      //sí creaste la partida
      if (myTurn) {
        // true: le toca a player 1
        socket.emit("selected-field", index, symbol, match, PIN, myName);
      }
    } else {
      //si te uniste
      if (!myTurn) {
        //false: le toca a player 2
        socket.emit("selected-field", index, symbol, match, PIN, myName);
      }
    }
  };

  return (
    <div className="table">
      <div className="table__lines">
        <div className="line vertical"></div>
        <div className="line vertical"></div>
        <div className="line horizontal"></div>
        <div className="line horizontal"></div>
      </div>

      <div className="table__symbols">
        {match.map((exOrCirCle, i) =>
          !exOrCirCle ? (
            <div
              className="symbol"
              key={i}
              style={{ width: "80%", height: "80%" }}
              onClick={handleClick(i)}
            ></div>
          ) : (
            <div
              className="symbol"
              key={i}
              style={{ width: "80%", height: "80%" }}
              onClick={handleClick(i)}
            >
              <img src={symbols[exOrCirCle - 1]} alt="symbol" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Table;
