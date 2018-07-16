import web3 from './web3';
import PiggyBank from './build/PiggyBank.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(PiggyBank.interface), address);
};
