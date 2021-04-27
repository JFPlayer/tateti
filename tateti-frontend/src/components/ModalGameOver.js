import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";

const ModalPIN = () => {
  const { myName, winner, noWinner, socket, PIN } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("try-again", () => {
      dispatch({
        type: 'TRY_AGAIN'
      })
    })
  }, [])

  const handleClick = () => {
    socket.emit("try-again", PIN);
  };

  return (
    <Modal>
      <div className="modal" onClick={handleClick}>
        <div style={{ fontSize: "8rem" }}>
          {noWinner ?
            <span>
              Empate
              <br />
              🤣
            </span>
          :
          winner === myName ? (
            <span>
              Ganaste
              <br />
              😀
            </span>
          ) : (
            <span>
              Perdiste
              <br />
              🙁
            </span>
          )}
        </div>
        <div style={{ fontSize: "3rem" }}>
          <span>Click para continuar...</span>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPIN;
