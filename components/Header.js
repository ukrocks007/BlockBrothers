import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu className="headerBar" style={{ marginTop: '15px', backgroundColor: '#f0efef', padding: '5 px', }}>
      <Link route="/">
        <a className="item"><h3>BlockBrothers</h3></a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item"><h3>Insurances</h3></a>
        </Link>

        <Link route="/insurance/insurancePlan">
          <a className="item"><h3>Plans</h3></a>
        </Link>

        <Link route="/claimsApprover">
          <a className="item"><h3>Admin Console</h3></a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
