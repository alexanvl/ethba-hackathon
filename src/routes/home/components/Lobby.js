import React, { Component } from 'react';
import _ from 'lodash';

import { injectRedux } from '../../../components';

class Lobby extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  updateLobby = lobby => {
    this.setState({ lobby });
  }

  updateProposal = proposal => {
    this.setState({ proposal });
  }

  updateTimeout = _ => {
    const myLobbyEntry = {};
    myLobbyEntry[this.props.myAccount] = { publicKey: this.props.myAccount, timestamp: Date.now() };
    this.props.firebaseActions.update('lobby', myLobbyEntry);
    this.setState({ lastUpdate: Date.now() })
    setTimeout(this.updateTimeout, 5000);
  }

  componentDidMount() {
    this.props.firebaseActions.listenOn('lobby', this.updateLobby);
    this.props.firebaseActions.listenOn(`agreementProposal/${this.props.myAccount}`, this.updateProposal);
    this.updateTimeout();
  }

  render() {
    const { lobby = [], lastUpdate, proposal } = this.state;
    const { myAccount } = this.props;
    const users = _.filter(lobby, player => player.timestamp > Date.now() - 10000);
    return <div>
      <h1>Lobby (You are {myAccount} and updated at {lastUpdate})</h1>
      {_.map(users, user => <div key={user.publicKey}>
        {user.publicKey}
      </div>)}
      <h1>Current Proposal</h1>
      {proposal && <div>
        from: {proposal.agreement.partyA}
        {proposal.agreement.openPending && <button onClick={_ => this.props.joinAgreement(proposal.agreement, proposal.state)}>Join Agreement</button>}
        {!proposal.agreement.openPending && <button onClick={_ => this.props.updateAgreement(proposal.agreement)}>Update Agreement</button>}
        {!proposal.agreement.openPending && <button onClick={_ => this.props.openChannel(proposal.agreement)}>Open Channel</button>}
        {proposal.agreement && proposal.chan && <button onClick={_ => this.props.joinChannel(proposal.chan, proposal.agreement)}>Join Channel</button>}
        {proposal.chan && !proposal.chan.openPending && <button onClick={_ => this.props.updateAcceptedChannel(proposal.chan)}>Update Accepted Channel</button>}
        {proposal.chan && <button onClick={_ => this.props.sendUpdate(proposal.chan, proposal.agreement)}>Send Update</button>}
        {proposal.chan && <button onClick={_ => this.props.confirmUpdate(proposal.chan, proposal.agreement, proposal.updateState)}>Confirm Update</button>}
        {proposal.chan && <button onClick={_ => this.props.updateConfirmedUpdate(proposal.chan, proposal.agreement)}>Update Confirmed Update</button>}
      </div>}
    </div>;
  }

}

export default injectRedux(Lobby);
