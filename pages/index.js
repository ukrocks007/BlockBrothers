import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Insurance from '../ethereum/insurance';
import InsurancePlan from '../ethereum/InsurancePlan';
import Layout from '../components/Layout';
import { Link } from '../routes';

class InsuranceIndex extends Component {
  static async getInitialProps() {
    const insurances = await factory.methods.getUserInsurances(1).call();

    var planNames = new Array();

    for(let i in insurances)
    {
        let insurance = await Insurance(insurances[i]);
        let planAddr = await insurance.methods.planContract().call();
        let plan = await InsurancePlan(planAddr);
        let planName = await plan.methods.name().call();
        let provider = await plan.methods.provider().call();
        planNames.push(planName+" ("+provider+")");
    }

    return { insurances,
      planNames };
  }

  renderInsurances() {
    let i = 0;
    const items = this.props.insurances.map(address => {
      return {
        header: this.props.planNames[i++],
        description: (
          <Link route={`/insurance/${address}`}>
            <a><h4>View Insurance</h4></a>
          </Link>
        ),
        extra: (
          <a>Contract Address: {address}</a>
      ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h2><u>Your Insurance Policies</u></h2>

          <Link route="/insurance/insurancePlan">
            <a>
              <Button
                floated="right"
                content="Select an Insurance Plan"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderInsurances()}
        </div>
      </Layout>
    );
  }
}

export default InsuranceIndex;
