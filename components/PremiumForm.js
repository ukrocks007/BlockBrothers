import React, { Component } from 'react';
import { Form, Input, Message, Button, Segment } from 'semantic-ui-react';
import Insurance from '../ethereum/insurance';
import factory from '../ethereum/factory';
import paymentInterface from '../ethereum/Payments';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class PremiumForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
    insuranceState: 0,
  };

  async componentDidMount() {

    const insurance = await Insurance(this.props.address);

    const state = await insurance.methods.state().call();

    console.log("State: "+state);

    this.setState({insuranceState: state});

    var amount = parseFloat(this.props.data.premium) + parseFloat(this.props.data.catastropheFee);
    console.log("Amount : "+amount);
    this.setState({value: amount});
  }

  onSubmit = async event => {
    event.preventDefault();

    const paymentContract = await factory.methods.PaymentInterface().call();

    const payment = paymentInterface(paymentContract);

    this.setState({ loading: true, errorMessage: '' });

    try {
      console.log("Paying" + this.state.value);
      const accounts = await web3.eth.getAccounts();
      await payment.methods.payPremium(1, this.props.address).send({
        from: accounts[0],
        value: this.state.value
      });

      Router.reload('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <div>
        <Segment inverted>
        <h3>Premium Form</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label style={{color: 'white'}}>Pay for the insurance</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: this.state.value })}
              label="wei"
              labelPosition="right"
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading} disabled={this.state.insuranceState==1}>
          Pay!
          </Button>
        </Form>
        </Segment>
      </div>
    );
  }
}

export default PremiumForm;
