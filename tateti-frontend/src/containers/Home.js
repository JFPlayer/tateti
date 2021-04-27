import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../redux/tatetiDucks";

import logo from "../assets/logo.svg";
import Button from "../components/Button";

import "./styles/Home.scss";

const Home = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector(state => state)
  const inputRef = useRef();
  const [pinUpperCase, setPinUpperCase] = useState("")
  const [error, setError] = useState(false)
  const history = useHistory();
  
  useEffect(() => {
    dispatch(connectSocket());
  }, [])
  useEffect(() => {
    socket?.on('PIN-checked', (isPINValid) => { 
      if(isPINValid){
        dispatch({
          type: "JOIN_MATCH",
          payload: inputRef.current.value
        });
        history.push("/name");
      }else {
        setPinUpperCase("")
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 1000)
        //mensaje "pin invalido" o partida
      }
    })
  }, [socket])


  const handleJoinGame = () => {
    const pinValue = inputRef.current.value;
    socket.emit('PIN-check', pinValue)
  };

  const handleNewGame = () => {
    dispatch({
      type: "CREATE_MATCH",
    });
    history.push("/name");
  };

  return (
    <div className="home">
      <div className="home__logo">
        <img src={logo} alt="Tateti" />
      </div>
      <Button color="blue" handleClick={handleNewGame}>
        Crear una partida
      </Button>
      <div className="line"></div>
      <input
        className="home__input"
        ref={inputRef}
        value={pinUpperCase}
        onChange={() => setPinUpperCase(inputRef.current.value.toUpperCase())}
        type="text"
        placeholder={error ? "PIN invalido" : "PIN de partida"}
      />
      <Button color="magenta" handleClick={handleJoinGame}>
        Unirse <br />a una partida
      </Button>
    </div>
  );
};

export default Home;
