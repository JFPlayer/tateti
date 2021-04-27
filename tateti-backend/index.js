const express = require("express");
const app = express();
const Socketio = require("socket.io");

const PORT = process.env.PORT || 3000;

app.use("/", express.static("../tateti-frontend/build"));

app.get("/:a", (req, res) => {
  res.redirect("/");
});

const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const io = Socketio(server);

const rooms = {
  // "PIN": {
  //   L60yjHiof0B0HTZ0AAAB: "Player 1",
  //   qweqweqasdB0HTZ0AAAB: "Player 2",
  // },
};

io.on("connection", (socket) => {
  console.log("new conection ", socket.id);

  socket.on("new-match", (name) => {
    const newPIN = newPin();
    socket.join(newPIN);
    //crea en rooms[PIN] un objeto
    rooms[newPIN] = {};
    rooms[newPIN][socket.id] = name;
    console.log(`name: ${name}, pin: ${newPIN}, id: ${socket.id}`);
    socket.emit("new-pin", newPIN);
  });

  socket.on("PIN-check", (PIN) => {
    //checkear si existe el pin y solo hay una persona
    //si el pin existe o no
    const isPINValid = isValid(PIN);
    socket.emit("PIN-checked", isPINValid);
  });

  socket.on("join-match", (name, PIN) => {
    console.log(`name: ${name}, PIN: ${PIN}`);
    if (isValid(PIN)) {
      socket.join(PIN); //se une al romm
      rooms[PIN][socket.id] = name; //se agrega al room del PIN
      //a todos los de la sala le decis que comience
      console.log(rooms);
      const players = Object.values(rooms[PIN]); // ['joel', 'chop']
      io.to(PIN).emit("game-start", players);
      // socket.to(PIN).emit("game-start", players);
      // socket.emit("game-start", players);
    } else {
      socket.emit("room-not-available");
    }
  });

  socket.on("selected-field", (index, symbol, match, PIN, name) => {
    if(match[index] !== 0) return;
    //si el array "match" viene vacio
    //sucede porque match se actualiza cuando el servidor se lo envia a los clientes
    if(match.every(i => i !== 1 || i !== 2)) match[index] = symbol
    const array = getSelectedSigns(match, symbol);
    const isAWinner = selectWinner(array)
    if(!isAWinner && match.every(i => i !== 0)) {//empate
      io.to(PIN).emit("selected-field", index, symbol, match);
      io.to(PIN).emit("game-over", null);
      return;
    }
    if (isAWinner) {//hay un ganador
      io.to(PIN).emit("selected-field", index, symbol, match);
      io.to(PIN).emit("game-over", name);
    } else {
      io.to(PIN).emit("selected-field", index, symbol, match);
    }
  });

  socket.on("try-again", (PIN) => {
    io.to(PIN).emit("try-again");
  });

  socket.on("disconnect", () => {
    //si alguien se desconecta se elimina al usuario de rooms[PIN]
    getUserRooms(socket).forEach(PIN => {
      io.to(PIN).emit('user-disconnected')
      if(rooms[PIN] !== undefined && rooms[PIN][socket.id]){
        delete rooms[PIN][socket.id]
        //si fue el unico en la sala, se elimina la sala
        if(Object.values(rooms[PIN]).length === 0) delete rooms[PIN]
      }
    })
  })
});

function getUserRooms(socket){
  return Object.entries(rooms).reduce((acc, [PIN, players]) => {
    if(rooms[PIN][socket.id] !== null) return [...acc, PIN]
    return acc;
  }, [])
}

function newPin() {
  let result = "";
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function isValid(PIN) {
  return rooms[PIN] !== undefined && Object.values(rooms[PIN]).length === 1;
}

function check(array, val1, val2, val3) {
  return array.includes(val1) && array.includes(val2) && array.includes(val3);
}

function getSelectedSigns(array, symbol) {
  return array.reduce((acc, el, i) => {
    return el === symbol ? [...acc, i] : acc;
  }, []);
}

function selectWinner(array) {
  return (
    check(array, 0, 1, 2) ||
    check(array, 3, 4, 5) ||
    check(array, 6, 7, 8) ||
    check(array, 0, 4, 8) ||
    check(array, 2, 4, 6) ||
    check(array, 0, 3, 6) ||
    check(array, 1, 4, 7) ||
    check(array, 2, 5, 8)
  );
}
