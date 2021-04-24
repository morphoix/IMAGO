import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/global'
import { theme } from './styles/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home, 
        Fox, 
        Berries, 
        Gyza, 
        Ocean, 
        Flower, 
        Robot, 
        Flow, 
        Grid,
        Hope,
        Tank,
        FallsApart,
        Physis,
        ThreeDMenu } from './pages'
import Grids from './components/Grids'

function App() {
  return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <img id='logo' src="./assets/logo.png" alt="imago logo" />
          <small>web gallery by <a href="https://github.com/morphoix" target="_blank">morphoix</a></small>
          <Grids />
          <Switch>
            <Route path={'/'} exact component={ Home } />
            <Route path={'/Eternal Waiting'} exact component={ Fox } />
            <Route path={'/Gyza'} exact component={ Gyza } />
            <Route path={'/Berries'} exact component={ Berries } />
            <Route path={'/Ocean'} exact component={ Ocean } />
            <Route path={'/Vanilla Flower'} exact component={ Flower } />
            <Route path={'/Lost Planet'} exact component={ Robot } />
            <Route path={'/Flow'} exact component={ Flow } />
            <Route path={'/Grid'} exact component={ Grid } />
            <Route path={'/Hope'} exact component={ Hope } />
            <Route path={'/Tank'} exact component={ Tank } />
            <Route path={'/FallsApart'} exact component={ FallsApart } />
            <Route path={'/Physis'} exact component={ Physis } />
            <Route path={'/ThreeDMenu'} exact component={ ThreeDMenu } />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;