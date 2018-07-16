import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import InsurancePlan from '../../ethereum/InsurancePlan';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class InsuranceNew extends Component {
  state = {
    premium: 0,
    catastropheFee: 1000,
    duration: 1,
    errorMessage: '',
    loading: false
  };

  static async getInitialProps(props) 
  {
    const plan = props.query.address;

    const planContract = await InsurancePlan(plan);

    const accounts = await web3.eth.getAccounts();

    console.log(accounts);

    const planInfo = await factory.methods.getInsurancePlanInfo(props.query.address).call();

    return {
      address: plan,
      name: planInfo[1],
      provider: planInfo[2],
      premium: planInfo[3],
      account: accounts[0],
      catastropheFee: 1000,
    };
  }
      

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    if(parseInt(this.state.duration) < 0){
      this.setState({ errorMessage: "Duration can not be negative!" });
      this.setState({ loading: false });
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createInsurance(1, 1, this.state.catastropheFee, this.props.address, this.state.duration)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  componentDidMount() {
    this.setState({premium: this.props.premium});
  }

  render() {
    return (
      <Layout>
        <h3>Create a Insurance</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Premium</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.premium}
              disabled
              onChange={event =>
                this.setState({ premium: this.props.premium })}
            />
          </Form.Field>

          <Form.Field>
            <label>Catastrophe Fee</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.catastropheFee}
              disabled
              onChange={event =>
                this.setState({ catastropheFee: this.state.catastropheFee })}
            />
          </Form.Field>

          <Form.Field>
            <label>Duration</label>
            <Input
              label="Years"
              labelPosition="right"
              value={this.state.duration}
              onChange={event =>
                {
                  this.setState({ duration: event.target.value });

                  let premium = parseInt(this.props.premium);
                  let catastropheFee = parseInt(this.props.catastropheFee);
                  let duration = parseInt(event.target.value);
                  
                  if(parseInt(event.target.value) >= 1)
                  {
                    this.setState({ premium: premium*duration });
                    this.setState({ catastropheFee: catastropheFee*duration });
                  }
              }
            }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary disabled={!parseInt(this.state.duration)}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default InsuranceNew;
