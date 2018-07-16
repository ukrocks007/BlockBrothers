import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Insurance from '../../ethereum/insurance';
import ClaimsContract from '../../ethereum/Claims';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import ClaimRequest from '../../ethereum/ClaimRequests';
import ClaimForm from '../../components/ClaimForm';
import { Link } from '../../routes';

class InsuranceShow extends Component {
  static async getInitialProps(props) {
    const insurance = Insurance(props.query.address);

    const claims = await factory.methods.ClaimsInterface().call();

    const claimsInterface = ClaimsContract(claims);

    console.log("searching requests for "+props.query.id);

    const requests = await claimsInterface.methods.getRequestsForUser(props.query.id).call();

    var unapprovedRequests = new Array();
    var reasons = new Array();
    var amounts = new Array();

    for(let i in requests){
      let req = await ClaimRequest(requests[i]);
      let approved = await req.methods.approved().call();
      let reason = await req.methods.claimReason().call();
      let amount = await req.methods.amount().call();
      if(!approved)
      {
        unapprovedRequests.push(requests[i]);
        reasons.push(reason);
        amounts.push(amount);
      }
    }

    console.log(unapprovedRequests);
    return {
      id: props.query.id,
      requests : unapprovedRequests,
      reasons : reasons,
      amounts: amounts,
    };
  }

  renderCards() {
    var arr = this.props.requests;
    let i = 0;
    const items = arr.map(address => {
      return {
        header: this.props.reasons[i],
        meta: this.props.amounts[i++] + " wei",
        description: (
          <Link route={`/claimsApprover/approve/${address}`}>
            <a>Approve</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Claim Requests</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default InsuranceShow;
