import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Matter from 'matter-js';

import { AudioPlayer, Body, Sprite } from 'react-game-kit';
import HealthBar from './healthBar';

// @observer
export default class Character extends Component {
  static propTypes = {
    keys: PropTypes.object,
    side: PropTypes.string,
    isActive: PropTypes.bool,
    fighter: PropTypes.string,
    health: PropTypes.number
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.loopID = null;
    this.side = props.side;
    this.isActive = props.isActive;
    this.fighter = props.fighter;
    this.health = props.health;

    this.isPunching = false;
    this.isKicking = false;
    this.isUltraing = false;
    this.isKOd = false;
    this.isWon = false;
    this.isBlocked =false;
    this.lastX = 0;

    this.state = {
      characterState: 2,
      loop: false,
      spritePlaying: true,
      stageX: 0,
      characterPosition: {
        x: this.side == 'l' ? 0 : 400,
        y: 20
      },
      characterHealth: 2000
    };

    this.handlePlayStateChanged = this.handlePlayStateChanged.bind(this);
    this.punch = this.punch.bind(this);
    this.kick = this.kick.bind(this);
    this.ultra = this.ultra.bind(this);
    this.KO = this.KO.bind(this);
    this.victory = this.victory.bind(this);
    this.block = this.block.bind(this);
    
    this.checkKeys = this.checkKeys.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    // this.jumpNoise = new AudioPlayer('/assets/jump.wav');
    Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
  }

  getWrapperStyles() {
    const { characterPosition, stageX } = this.state;
    const { scale } = this.context;
    const { x, y } = this.state.characterPosition;
    const targetX = x + stageX;

    return {
      position: 'absolute',
      transform: `translate(${targetX * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top',
    };
  }

  render() {
    const x = this.state.characterPosition.x;

    return (
      <div>
        <div style={this.getWrapperStyles()}>
          <HealthBar 
            health={this.state.characterHealth}
          />
          <Body
            args={[x, 84, 600, 600]}
            inertia={Infinity}
            ref={b => {
              this.body = b;
            }}
          >
            <Sprite
              repeat={this.state.repeat}
              onPlayStateChanged={this.handlePlayStateChanged}
              src={"./src/assets/fighter"+this.fighter+"_"+this.side+".png"}
              scale={this.context.scale}
              state={this.state.characterState}
              steps={[2, 2, 2, 2, 1, 2, 1]}
              tileHeight={600}
              tileWidth={600}
            />
          </Body>
        </div>
      </div>
    );
  }

  handlePlayStateChanged(state) {
    this.setState({
      spritePlaying: state ? true : false,
    });
  };

  move(body, x) {
    Matter.Body.setVelocity(body, { x, y: 0 });
  };

  punch() {
    this.isPunching = true;
    this.setState({
      characterState: 0,
      repeat: false,
    });
  };

  kick() {
    this.isKicking = true;
    this.setState({
      characterState: 1,
      repeat: false,
    });
  };

  ultra() {
    this.isUltraing = true;
    this.setState({
      characterState: 3,
      repeat: false,
    });
  };

  KO() {
    this.isKOd = true;
    this.setState({
      characterState: 6,
      repeat: false,
    });
  };

  block() {
    this.isBlocked = true;
    this.setState({
      characterState: 4,
      repeat: false,
    });
  };

  victory() {
    this.isWon = true;
    this.setState({
      characterState: 5,
      repeat: true,
    });
  };

  loseHealth(point) {
    this.setState({
      characterHealth: (this.state.characterHealth - 20 * point) >= 0 ? (this.state.characterHealth - 20 * point) : 0
    });
  }

  checkKeys(shouldMoveStageLeft, shouldMoveStageRight) {
    const { keys, store } = this.props;
    const { body } = this.body;

    let characterState = 2;

    if (this.isActive) {
      if (keys.isDown(75)) {
        // if (shouldMoveStageLeft) {
        //   this.state.setStageX(this.state.stageX + 5);
        // }

        this.move(body, -5);
        this.kick();
        characterState = 1;
      } else if (keys.isDown(80)) {
        this.move(body, 5);
        this.punch();
        characterState = 0;
      } else if (keys.isDown(85)) {
        this.loseHealth(2);
        this.move(body, 5);
        this.ultra();
        characterState = 3;
      } else if (keys.isDown(keys.LEFT)) {
        this.KO();
        characterState = 6;
      } else if (keys.isDown(keys.RIGHT)) {
        this.victory();
        characterState = 5;
      } else if (keys.isDown(keys.SPACE)) {
        this.block();
        characterState = 4;
      }

      this.setState({
        characterState,
        repeat: characterState < 6,
      });

    }
  };

  update() {
    const { body } = this.body;

    const midPoint = Math.abs(this.state.stageX) + 448;

    const shouldMoveStageLeft = body.position.x < midPoint && this.state.stageX < 0;
    const shouldMoveStageRight =
      body.position.x > midPoint && this.state.stageX > -2048;

    // const velY = parseFloat(body.velocity.y.toFixed(10));

    // if (velY === 0) {
    //   this.isJumping = false;
    //   Matter.Body.set(body, 'friction', 0.9999);
    // }

    if (this.state.characterHealth == 0) {
      console.log("KO!");
      this.KO();
      characterState = 6;
      this.setState({
        characterState,
        repeat: true,
      });
    }

    if (!this.isJumping && !this.isPunching && !this.isLeaving) {
      this.checkKeys(shouldMoveStageLeft, shouldMoveStageRight);

      // this.state.setCharacterPosition(body.position);
    } else {
      if (this.isPunching && this.state.spritePlaying === false) {
        this.isPunching = false;
      }
      if (this.isJumping) {
        // this.state.setCharacterPosition(body.position);
      }
      const targetX = this.state.stageX + (this.lastX - body.position.x);
      // if (shouldMoveStageLeft || shouldMoveStageRight) {
      //   this.state.setStageX(targetX);
      // }
    }

    this.lastX = body.position.x;
  };
}
