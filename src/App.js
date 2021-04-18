import React, { useState, useRef } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/global'
import { theme } from './styles/theme'
import { Burger, Menu } from './components'
import { useOnClickOutside } from './hooks'
import FocusLock from 'react-focus-lock'
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
        Physis } from './pages'

function App() {
  const [ open, setOpen ] = useState(false)
  const ref = useRef()
  const menuId = "main-menu"

  useOnClickOutside(ref, () => setOpen(false))

  return (
    <>
      <FocusLock disabled={!open}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <img id='logo' src="./assets/logo.png" alt="imago logo" />
          <small>web gallery by <a href="https://github.com/morphoix" target="_blank">morphoix</a></small>
          <BrowserRouter>
          <div ref={ref}>
            <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
            <Menu open={open} setOpen={setOpen} id={menuId} />
          </div>
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
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </FocusLock>
    </>
  );
}

export default App;