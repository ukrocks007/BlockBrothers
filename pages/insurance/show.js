import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Insurance from '../../ethereum/insurance';
import web3 from '../../ethereum/web3';
import PremiumForm from '../../components/PremiumForm';
import ClaimForm from '../../components/ClaimForm';
import { Link } from '../../routes';

class InsuranceShow extends Component {
  static async getInitialProps(props) {
    const insurance = Insurance(props.query.address);

    const summary = await insurance.methods.getSummary().call();

    return {
      address: props.query.address,
      premium: summary[0],
      catastropheFee: summary[1],
      policyStarted: summary[2],
      duration: summary[3],
      policyState: summary[4]
    };
  }

  renderCards() {
    const {
      premium,
      catastropheFee,
      policyStarted,
      duration,
      policyState
    } = this.props;

    var stateString = "";

    if(policyState == 0){
      stateString = "Inactive";
    }
    else if(policyState == 1){
      stateString = "Active";
    }
    else if(policyState == 2){
      stateString = "Claim Requested";
    }
    else{
      stateString = "Closed";
    }

    var date = "";
    if(policyStarted == 0)
      date = "No premium paid yet!";
    else
      date = new Date(policyStarted * 1000).toDateString();

    const items = [
      {
        header: web3.utils.fromWei(premium, 'ether'),
        meta: 'The premium amount paid for the insurance policy.',
        description:
          'The owner of the policy gets the premium back if there aren`t any claims in the duration of the policy.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(catastropheFee, 'ether'),
        meta: 'The catastrophe fee paid for the insurance policy.',
        description:
          'This will be stored in Catastrophe Fund.'
      },
      {
        header: date,
        meta: 'Date when the policy has started.',
        description:
          'Policy cover get started once you pay the premium.'
      },
      {
        header: duration,
        meta: 'Years for which you are covered.',
        description:
          ''
      },
      {
        header: stateString,
        meta: 'Current state of the policy.',
        description:
          ''
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <style jsx global>
        {`
        .ui.card>.content,
        .ui.cards>.card>.content {
        background-color: #e6e2d3;
        }

        .ui.card>.content.extra,
        .ui.cards>.card>.content.extra {
        background-color: #92a8d1;
        }
      `}
      </style>
        <h3>Insurance Dashboard</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <PremiumForm address={this.props.address} data={this.props}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <ClaimForm address={this.props.address} data={this.props}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default InsuranceShow;
