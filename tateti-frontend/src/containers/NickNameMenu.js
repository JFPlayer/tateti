import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import "./styles/NickNameMenu.scss";
import Button from "../components/Button";

const NickNameMenu = () => {
  const inputRef = useRef();
  const [error, setError] = useState(false)
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { socket, PIN, symbol, myName } = useSelector((state) => state);

  useEffect(() => {
    socket.on("new-pin", (pin) => {
      history.push("/game");
      dispatch({
        type: "SET_PIN",
        payload: pin,
      });
    });

    socket.on('room-not-available', () => {
      //sala llena
      setError(true)
    })

    socket.on("game-start", ([player1, player2]) => {
      let oponent = "";
      if(player1 === myName) {
        oponent = player2
      }else {
        oponent = player1
      }
      console.log(player1, player2)
      console.log(`myName: ${myName}, oponent: ${oponent}`)
      dispatch({
        type: "SET_OPONENT",
        payload: oponent,
      });
      if (location.pathname === "/name") history.push("/game");
    });
  }, [myName])



  const handleSendName = () => {
    let name = inputRef.current.value;
    if (name === "") name = `Player ${symbol}`;
    //si pin existe es porque se esta uniendo
    PIN ? socket.emit("join-match", name, PIN) : socket.emit("new-match", name);
    dispatch({
      type: "SET_NAME",
      payload: name,
    });
  };

  return (
    <div className={`menu ${PIN ? "magenta" : "blue"}`}>
      <div className="menu__form">
        {/* <span>{PIN}</span> */}
        <span>Nick Name</span>
        <input ref={inputRef} type="text" placeholder="Player" />
      </div>
      {error && (
        <div style={{color:"black", textAlign: "center"}}>
          <span>PARTIDA<br/>NO DISPONIBLE</span>
        </div>
      )}
      <Button color={!PIN ? "magenta" : "blue"} fontSize="8rem" handleClick={handleSendName}>
        INICIAR
      </Button>
    </div>
  );
};

export default NickNameMenu;
