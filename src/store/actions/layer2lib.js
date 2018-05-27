const actions = {
  INIT: 'INIT',
};

export function init(privateKey, publicKey) {
  return { type: actions.INIT, privateKey, publicKey };
}

export default actions;
