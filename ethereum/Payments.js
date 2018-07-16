import web3 from './web3';
import Payments from './Build/Payments.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Payments.interface), address);
};
