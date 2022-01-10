import React from 'react';
import {ThemeProvider} from 'styled-components';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import {GlobalStyles} from './styles/global';
import {theme} from './styles/theme';
import * as Pages from './pages';
import Grids from './components/Grids';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <small>
          web gallery by
          <a href="https://github.com/morphoix" target="_blank">
            morphoix
          </a>
        </small>
        <Grids />
        <Routes>
          <Route path={'/'} element={<Navigate to="home" replace={true} />} />
          <Route path={'home'} index element={<Pages.Home />}  />
          <Route path={'Gyza'} element={<Pages.Gyza />} />
          <Route path={'Berries'} element={<Pages.Berries />} />
          <Route path={'Ocean'} element={<Pages.Ocean />} />
          <Route path={'LostPlanet'} element={<Pages.Robot />} />
          <Route path={'Flow'} element={<Pages.Flow />} />
          <Route path={'Grid'} element={<Pages.Grid />} />
          <Route path={'Hope'} element={<Pages.Hope />} />
          <Route path={'Tank'} element={<Pages.Tank />} />
          <Route path={'FallsApart'} element={<Pages.FallsApart />} />
          <Route path={'Physis'} element={<Pages.Physis />} />
          <Route path={'ThreeDMenu'} element={<Pages.ThreeDMenu />} />
          <Route path={'Darkness'} element={<Pages.Darkness />} />
          <Route path={'Ice'} element={<Pages.Ice />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
