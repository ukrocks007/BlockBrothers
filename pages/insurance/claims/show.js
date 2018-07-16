import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class InsuranceNew extends Component {
  state = {
    account: '',
    premium: 0,
    catastropheFee: 0,
    duration: 0,
    errorMessage: '',
    loading: false
  };

  componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({account: account[0]});
  }

  render() {
    return (
      <Layout>
        <h3>Claims for {this.state.account}</h3>

      </Layout>
    );
  }
}

export default InsuranceNew;
