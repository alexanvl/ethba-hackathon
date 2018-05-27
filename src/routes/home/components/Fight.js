import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import bgImage from './assets/background.jpg';

import Matter from 'matter-js';

import { AudioPlayer, Loop, Stage, KeyListener, World } from 'react-game-kit';
import Character from './character';
import HealthBar from './healthBar';

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

  componentWillUnmount() {
    // this.stopMusic();
    this.keyListener.unsubscribe();
  }

  render() {
    let stageStyle = {
      background: "url('./src/assets/background.jpg') top center fixed",
    };
    return (
      <Loop>
        <Stage style={ stageStyle }>
          <World onInit={this.physicsInit}>
            <Character
              fighter={this.fighters[0].name}
              isActive={false}
              side="l"
              keys={this.KeyListener}
              health={this.fighters[0].health}
            />
            <Character
              fighter={this.fighters[1].name}
              isActive={true}
              side="r"
              keys={this.KeyListener}
              health={this.fighters[1].health}
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
    let V = {
      name: 'Vitalik',
      health: 1
    }
    let S = {
      name: 'Satoshi',
      health: 1
    }
    this.fighters = [V, S];
  }
}

export default App;
