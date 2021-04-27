import React from 'react'
import { useSelector } from 'react-redux'
import Modal from './Modal'


const ModalPIN = () => {
  const { PIN } = useSelector(state => state)

  return (
    <Modal>
      <div className="modal">
        <div>
          <span>Comparte el PIN</span>
        </div>
        <div style={{fontSize:"8rem"}}>
          <span>{PIN}</span>
        </div>
        <div>
          <span>Esperando<br/>a otro jugador...</span>
        </div>
      </div>
    </Modal>
  )
}

export default ModalPIN
