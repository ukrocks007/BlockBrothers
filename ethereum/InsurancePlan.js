import web3 from './web3';
import InsurancePlan from './Build/InsurancePlan.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(InsurancePlan.interface), address);
};
