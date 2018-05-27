import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import Matter from 'matter-js';

import { AudioPlayer, Loop, Stage, KeyListener, World } from 'react-game-kit';
import Character from './character';
//import GameStore from './stores/game-store';
import { init } from '../../../store/actions/layer2lib';
const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


class Fight extends Component {
  // static propTypes = {
  //   onLeave: PropTypes.func,
  // };

  componentDidMount() {
    // this.player = new AudioPlayer('/assets/music.wav', () => {
    //   this.stopMusic = this.player.play({
    //     loop: true,
    //     offset: 1,
    //     volume: 0.35,
    //   });
    // });

    this.KeyListener.subscribe([
      this.KeyListener.LEFT,
      this.KeyListener.RIGHT,
      this.KeyListener.UP,
      this.KeyListener.SPACE,
      80,
      75,
      85
    ]);
  }

  // componentWillUnmount() {
  //   this.stopMusic();
  //   this.keyListener.unsubscribe();
  // }

  render() {
    return (
      <Loop>
        <Stage style={{ background: '#3a9bdc' }}>
          <World onInit={this.physicsInit}>
            <Character
              keys={this.KeyListener}
            />
          </World>
        </Stage>
      </Loop>
    );
  }

  physicsInit(engine) {
    const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
      isStatic: true,
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true,
    });

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true,
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  };

  constructor(props) {
    super(props);
    this.KeyListener = new KeyListener();
  }
}

export default Fight;
