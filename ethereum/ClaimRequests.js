import web3 from './web3';
import Claims from './Build/ClaimRequest.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Claims.interface), address);
};
