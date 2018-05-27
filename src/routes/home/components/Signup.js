import React, { Component } from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import Layer2LibTester from './components/Layer2LibTester';
import { injectRedux } from '../../components';
import bgImage from './images/background.jpg';
import meta from './meta';
import styles from './styles';
import Signup from './components/Signup';

const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
        <div>
            
        </div>
    );
  }
}

export default injectRedux(Signup);
