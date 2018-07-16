import React, { Component } from 'react';
import { Form, Button, Input, Message, Segment } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class InsuranceNew extends Component {
  state = {
    userId: ''
  };

  onSubmit = async event => {
    event.preventDefault();

    Router.pushRoute('/claimsApprover/show/'+this.state.userId);
  };

  render() {
    return (
        <Layout>
          <Segment style={{backgroundColor: '#588c7e', color: 'white'}}>
          <h3>Search Claim Requests</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <label style={{color:'white'}}>User Id</label>
              <Input
                value={this.state.userId}
                onChange={event =>
                  this.setState({ userId: event.target.value })}
              />
            </Form.Field>

            <Button primary>
              Search!
            </Button>
          </Form>
          </Segment>
        </Layout>
    );
  }
}

export default InsuranceNew;
