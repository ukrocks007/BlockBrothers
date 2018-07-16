import React, { Component } from 'react';
import { Segment, Form, Input, Message, Button } from 'semantic-ui-react';
import Insurance from '../ethereum/insurance';
import factory from '../ethereum/factory';
import claimInterface from '../ethereum/Claims';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ClaimForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
    insuranceState: 0,
    reason: '',
  };

  async componentDidMount() {

    const insurance = await Insurance(this.props.address);

    const state = await insurance.methods.state().call();

    console.log("State: "+state);

    this.setState({insuranceState: state});
  }

  onSubmit = async event => {
    event.preventDefault();

    console.log("Value" + this.state.value);
    console.log("address" + this.props.address);

    const accounts = await web3.eth.getAccounts();

    const claimContract = await factory.methods.ClaimsInterface().call();

    const claim = claimInterface(claimContract);

    this.setState({ loading: true, errorMessage: '' });

    try {

      const res = await claim.methods.requestClaim(1, this.state.value, ""+this.props.address, this.state.reason).send({from: accounts[0]});
      
      Router.reload('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {

    if(this.props.data.policyState != 2){
      return (
        <Segment inverted>
        <h3>Claim Form</h3>
        <Form inverted onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Enter the claim amount</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              label="wei"
              labelPosition="right"
            />
          </Form.Field>

           <Form.Field>
            <label>Enter the details about claim</label>
            <Input
              value={this.state.reason}
              onChange={event => this.setState({ reason: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading} disabled={this.state.insuranceState!=1}>
            Request Claim!
          </Button>
        </Form>
        </Segment>
      );
    }
    else {
      return null;
    }
  }
}

export default ClaimForm;
