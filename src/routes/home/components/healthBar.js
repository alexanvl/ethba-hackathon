import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HealthBar extends Component {
  static propTypes = {
    health: PropTypes.number,
  };
  
  constructor() {
    super();
    // debugger;
    this.state = { 
      health: 2000,
      spent: 2000,
      spending: 0,
    };
    
    this.setHealth = this.setHealth.bind(this);
  }
  
  setHealth(amount) {
    this.setState({spent: amount});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setHealth(this.props.health);
    }
  }
 
  render() {
    
    let bal = (this.state.health - this.state.spent - this.state.spending)
    let spentPercent = (this.state.spent / this.state.health * 100);
    let spendingPercent = (this.state.spending / this.state.health * 100);
    let balPercent = (100 - spentPercent - spendingPercent);
    return (
      <div>
        <div className='balanceBar'>
          <div className='balanceSection spent' style={{'width': spentPercent+'%'}}></div>
          <div className='balanceSection spending' style={{'width': spendingPercent+'%'}}></div>
          <div id='left' className='balanceSection left' style={{'width': balPercent+'%'}}></div>    
        </div>
      </div>
    );
  }
}