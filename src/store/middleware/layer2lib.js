import * as Layer2lib from 'js-layer2lib';
import bindActions, { actionTypes } from '../actions';
import firebase from './firebase/api';

const Web3 = require('web3');
const web3 = new Web3();

let layer2lib = null

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {

      case actionTypes.layer2lib.INIT: {
        if (!layer2lib) {
          const firebaseProxy = new Layer2lib.FirebaseStorageProxy(firebase, `layer2_${action.publicKey}/`);
          const options = {
            db: firebaseProxy,
            privateKey: action.privateKey
          }

          layer2lib = new Layer2lib("http://localhost:8545", options);
          layer2lib.initGSC();
        }
        return layer2lib;
      }
      default:
        return next(action);
    }
  };
}
