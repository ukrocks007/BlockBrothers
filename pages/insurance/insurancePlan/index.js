import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../../../ethereum/factory';
import InsurancePlan from '../../../ethereum/InsurancePlan';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

class InsurancePlanIndex extends Component {
  static async getInitialProps() {
    const plans = await factory.methods.getInsurancePlanList().call();

    var plansInfo = new Array();

    for(let i in plans){
        var info = await factory.methods.getInsurancePlanInfo(plans[i]).call();
        console.log(info);
        plansInfo.push(info);
    }

    return { plansInfo };
  }

  renderPlans() {
    const items = this.props.plansInfo.map(info => 
    {
        return {
        header: info[1],
        description: "Brought to you by "+info[2],
        meta: <b>Premium: {info[3]} wei</b>,
        extra:(
            <Link route={`/insurance/new/${info[0]}`}>
            <a><b>Buy Insurance</b></a>
          </Link>
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
          <h2><u>Available Insurance Plans</u></h2>

          <Link route="/insurance/insurancePlan/new">
            <a>
              <Button
                floated="right"
                content="Create Insurance Plan"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderPlans()}
        </div>
      </Layout>
    );
  }
}

export default InsurancePlanIndex;
