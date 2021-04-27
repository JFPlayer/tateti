import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './containers/Home'
import NickNameMenu from './containers/NickNameMenu'
import Game from './containers/Game'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/name" component={NickNameMenu} />
        <Route exact path="/game" component={Game} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
