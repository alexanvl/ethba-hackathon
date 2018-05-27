import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { injectAuthRedirect, injectAuthRequired } from '../components';
import styles from './styles';
import Home from './home';
import Fight from './home/components/Fight';

export default (props) => {
  return (
    <div>
      <BrowserRouter >
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/fight' component={Fight} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}