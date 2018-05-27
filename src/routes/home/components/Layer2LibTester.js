import React, { Component } from 'react';
import Layer2Lib from 'js-layer2lib';

import Lobby from './Lobby';

import { injectRedux } from '../../../components';

import { init } from '../../../store/actions/layer2lib';

const privateKeys = {
  '0x47f5744364871e442967ef9624d0e5b6d867ad50': '0x6cb2b4257e4477b096beacc755b6abf45d9d67738522aa27d3c2e1444eb4ea80',
  '0x52721196a9bfd4ecb2ecbec8122183f59cfdb201': '0x7d62b5a4caa26ff7833a37c1b0b3cf2ead49d9942f4ed940c54d9d70275b4591',
  '0xd156363d387d6a7350f3f40d353eba7912cfacb7': '0x7942483b9ba28f92c2cb4014104c5629de7a41c56ebd832377ca3a4950459c2e'
};

const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const myBalance = web3.toWei(0.1, 'ether');
const counterpartyBalace = web3.toWei(0.2, 'ether');

class Layer2LibTester extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  initLayer2 = _ => {
    const myAccount = this.refs.myAccountSelector.value;
    const myPrivateKey = privateKeys[myAccount];
    this.layer2lib = this.props.layer2libActions.init(myPrivateKey, myAccount);
    this.setState({ layer2Initialized: true, myAccount });
  }

  joinAgreement = async (counterPartyAgreement, CounterPartyAgreementState) => {
    let myAgreement = JSON.parse(JSON.stringify(counterPartyAgreement))
    myAgreement.dbSalt = this.state.myAccount

    await this.layer2lib.joinGSCAgreement(myAgreement, CounterPartyAgreementState)
    this.setState({
      myAgreement
    })
    this.props.firebaseActions.update(`agreementProposal/${myAgreement.partyA}`, { agreement: myAgreement });
  }


  updateAcceptedAgreement = async updatedAgreement => {
    const myAgreement = Object.assign({}, updatedAgreement, { dbSalt: this.state.myAccount});
    await this.layer2lib.gsc.updateAgreement(myAgreement);
    this.setState({
      myAgreement
    })
  }

  startAgreement = async _ => {
    const myAccount = this.state.myAccount;
    const counterpartyAccount = this.refs.counterpartyAccountSelector.value;
    this.layer2lib.initGSC()

    // clear database
    await this.layer2lib.gsc.clearStorage()

    let myAgreement = {
      dbSalt: myAccount, // for testing multiple layer2 instances on same db
      ID: `agreement_${myAccount}${counterpartyAccount}`,
      types: ['Ether'],
      partyA: myAccount, // Viewer or performer public key
      partyB: counterpartyAccount, // Spank Hub public key
      balanceA: myBalance,
      balanceB: counterpartyBalace
    }

    let agreementId = myAgreement.ID + myAgreement.dbSalt

    await this.layer2lib.createGSCAgreement(myAgreement)

    let My_agreement = await this.layer2lib.getGSCAgreement(agreementId)
    //console.log(col)
    let My_tx = await this.layer2lib.gsc.getTransactions(agreementId)
    //console.log(Alice_tx)
    let MyAgreementState = await this.layer2lib.gsc.getStates(agreementId)
    //Grab the latest (currently only state in list)
    MyAgreementState = MyAgreementState[0]
    //console.log(AliceAgreementState)

    console.log('My agreement created and stored.. sending to other');
    this.setState({
      myAgreement
    })
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { state: MyAgreementState, agreement: myAgreement});
    //TODO: do send
  }

  openChannel = async agreement => {
    const myAccount = this.state.myAccount;
    const counterpartyAccount = this.refs.counterpartyAccountSelector.value;

    const dbSalt = myAccount;
    const ID = `channel_${myAccount}${counterpartyAccount}`;
    const agreementId = agreement.ID;
    let myChannel = {
      dbSalt, // for testing multiple layer2 instances on same db
      ID,
      agreementID: agreementId,
      type: 'ether',
      balanceA: web3.toWei(0.03, 'ether'),
      balanceB: web3.toWei(0.05, 'ether')
    }

    await this.layer2lib.openGSCChannel(myChannel)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}${dbSalt}`)
    //console.log(Alice_chan)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}${dbSalt}`)
    //console.log(Alice_agreement)
    // const MyChanState = await this.layer2lib.gsc.getStates(`${ID}${dbSalt}`)
    //console.log(AliceChanState)
    // const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreementId}${dbSalt}`)
    //console.log(AliceAgreementState)
    this.props.firebaseActions.update(`agreementProposal/${My_agreement.partyB}`, { Agreement: My_agreement, chan: My_chan });

  }

  joinChannel = async (chan, Agreement) => {
    const myAccount = this.state.myAccount;
    const counterpartyAccount = this.refs.counterpartyAccountSelector.value;

    const dbSalt = myAccount;
    const ID = `channel_${myAccount}${counterpartyAccount}`;
    const agreementId = Agreement.ID;

    let myChan = JSON.parse(JSON.stringify(chan))
    myChan.dbSalt = dbSalt
    let My_agreement = JSON.parse(JSON.stringify(Agreement))
    My_agreement.dbSalt = dbSalt
    await this.layer2lib.gsc.joinChannel(myChan, My_agreement, myChan.stateRaw)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}${dbSalt}`)
    //console.log(Bob_chan)
    My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}${dbSalt}`)
    //console.log(Bob_agreement)
    // let MyChanState = await this.layer2lib.gsc.getStates(`${ID}${dbSalt}`)
    //console.log(BobChanState)
    // MyAgreementState = await this.layer2lib.gsc.getStates(`${agreementId}${dbSalt}`)
    //console.log(BobAgreementState)

    // let txs_agreement = await this.layer2lib.gsc.getTransactions(`${agreementId}${dbSalt}`)
    // let txs_channel = await this.layer2lib.gsc.getTransactions(`${ID}${dbSalt}`)
    //console.log(txs_agreement)
    //console.log(txs_channel)
    this.props.firebaseActions.update(`agreementProposal/${Agreement.partyA}`, { Agreement: My_agreement });
  }

  updateAcceptedChannel = async Agreement => {
    const myAccount = this.state.myAccount;
    const dbSalt = myAccount;
    Agreement.dbSalt = dbSalt
    await this.layer2lib.gsc.updateAgreement(Agreement)
  }

  render() {
    const { layer2Initialized, myAccount } = this.state;
    return <div>
      {!layer2Initialized && <div><div>
        My Account: <select ref='myAccountSelector'>
          {web3.eth.accounts.slice(0,3).map(account => <option key={account}>
            {account}
          </option>)}
        </select>
      </div>
      <button onClick={this.initLayer2}>initLayer2</button></div>}

      {layer2Initialized && <div><div>
        Counterparty Account: <select ref='counterpartyAccountSelector'>
          {web3.eth.accounts.slice(0,3).map(account => <option key={account}>
            {account}
          </option>)}
        </select>
      </div>
      <button onClick={this.startAgreement}>Start Agreement</button>
      <button onClick={this.joinAgreement}>Join Agreement</button>
      <div>
        <h1>My agreement details:</h1>
        <pre>{JSON.stringify(this.state.myAgreement, undefined, 2)}</pre>
      </div>
    </div>}
      {layer2Initialized && <Lobby myAccount={this.state.myAccount}
        joinAgreement={this.joinAgreement}
        updateAgreement={this.updateAcceptedAgreement}
        openChannel={this.openChannel}
        joinChannel={this.joinChannel}
        updateAcceptedChannel={this.updateAcceptedChannel}
      />}
      {this.state.agreement && !this.state.agreement.openPending && <div><h1>Channel Stuff</h1>
      <div>
        <button onClick={_ => this.props.openChannel()}>Open Channel</button>
      </div></div>}
    </div>
  }

}

export default injectRedux(Layer2LibTester);
