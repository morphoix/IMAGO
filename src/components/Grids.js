import React, {useState, useRef} from 'react';
import {NavLink} from 'react-router-dom';
import {animated} from 'react-spring';
import styled from 'styled-components';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiceD20, faChevronCircleLeft, faHandSparkles} from '@fortawesome/free-solid-svg-icons';

import {useTransition, useSpring, useChain, config} from 'react-spring';
import data from '../data';
import Burger from './Burger/Burger';
import Header from './Header';

const Container = styled(animated.div)`
  position: absolute;
  right: 0;
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(20, minmax(20px, 1fr));
  grid-gap: 5px;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  will-change: width, heigh;
  @media (max-width: ${({theme}) => theme.mobile}) {
    display: flex;
    padding: 0;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const Item = styled(animated.div)`
  width: 50px;
  height: 50px;
  border: 25px solid transparent;
  border-radius: 4px;
  will-change: transform, opacity;
  @media (max-width: ${({theme}) => theme.mobile}) {
    height: 200px;
    width: 100%;
    border: 20px solid ${({theme}) => theme.primaryHover};
    padding: 20px;
    border-radius: none;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #db222a;
  font-size: 26px;
  margin: 10px;
  transition: all 1s;
  :hover {
    color: white;
  }
`;

const TouchIcon = styled(Icon)`
  color: ${(props) => (props.touch ? '#db222a' : '#053c5e')};
`;

const ToolWrapper = styled.div`
  dispaly: flex;
  flex-direction: row;
  height: 30px;
  width: 100px;
  justify-content: flex-start;
  z-index: 8889;
`;

export default function Grids() {
  const [open, setOpen] = useState(false);
  const [touch, setTouch] = useState(false);

  const springRef = useRef();
  const {size, opacity, ...rest} = useSpring({
    ref: springRef,
    config: config.stiff,
    from: {size: '0', background: 'transparent'},
    to: {size: open ? '100%' : '0'},
  });

  const transRef = useRef();
  const transitions = useTransition(open ? data : [], (item) => item.name, {
    ref: transRef,
    unique: true,
    trail: 400 / data.length,
    from: {opacity: 0, transform: 'scale(0)'},
    enter: {opacity: 1, transform: 'scale(1)'},
    leave: {opacity: 0, transform: 'scale(0)'},
  });

  useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6]);
  transitions.reverse();

  return (
    <Container style={{...rest, width: '100%', height: size}}>
      <Header open={open} touch={touch} />
      <ToolWrapper>
        {open ? (
          <Icon icon={faChevronCircleLeft} onClick={() => setOpen(false)} />
        ) : (
          <Icon icon={faDiceD20} onClick={() => setOpen(!open)} />
        )}
        <TouchIcon icon={faHandSparkles} touch={touch ? 1 : 0} onClick={() => setTouch(!touch)} />
      </ToolWrapper>
      <Burger open={open} setOpen={setOpen} onClick={() => setOpen((open) => !open)} />
      {transitions.map(({item, key, props}) => (
        <Item key={key} style={{...props}}>
          <NavLink to={item.nav || '/'} onClick={() => setOpen(false)}>
            {item.name}
          </NavLink>
        </Item>
      ))}
    </Container>
  );
}
