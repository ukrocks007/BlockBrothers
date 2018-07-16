import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Insurance from '../../ethereum/insurance';
import ClaimsContract from '../../ethereum/Claims';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import ClaimRequest from '../../ethereum/ClaimRequests';
import ClaimForm from '../../components/ClaimForm';
import { Router } from '../../routes';

class InsuranceShow extends Component {
  static async getInitialProps(props) {
    const request = ClaimRequest(props.query.address);

    const amount = await request.methods.amount().call();

    const accounts = await web3.eth.getAccounts();

    await factory.methods.approveClaim(props.query.address).send({from: accounts[0]});

    return {
      id: props.query.address
    };
  }

  render() {
    return (
      <Layout>
        <h3>Claim approved!</h3>
      </Layout>
    );
  }
}

export default InsuranceShow;
