import web3 from './web3';
import Insurance from './Build/Insurance.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Insurance.interface), address);
};
