import React from 'react'

import './styles/Button.scss'

const Button = ({ handleClick, color, fontSize = "4rem", children }) => {
  return (
    <div className={`btn ${color}`} style={{ fontSize: fontSize }} onClick={handleClick}>
      <span>
        {children}
      </span>
    </div>
  )
}

export default Button
