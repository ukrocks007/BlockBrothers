import React, { Component } from 'react';
import { Form, Button, Input, Message, Segment } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import factory from '../../../ethereum/factory';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';

class InsurancePlanNew extends Component {
  state = {
    premium: 0,
    name: '',
    provider: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createInsurancePlan(this.state.name, this.state.provider, this.state.premium)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/insurance/insurancePlan/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Segment style={{backgroundColor: '#588c7e'}}>
        <h3 style={{color:'white'}}>Create an Insurance Plan</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>

          <Form.Field>
            <label style={{color:'white'}}>Name of Policy</label>
            <Input
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label style={{color:'white'}}>Provider</label>
            <Input
              value={this.state.provider}
              onChange={event =>
                this.setState({ provider: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label style={{color:'white'}}>Premium</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.premium}
              onChange={event =>
                this.setState({ premium: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
        </Segment>
      </Layout>
    );
  }
}

export default InsurancePlanNew;
