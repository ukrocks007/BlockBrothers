import web3 from './web3';
import InsuranceFactory from './Build/InsuranceFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(InsuranceFactory.interface),
  'Contract_Address'
);

export default instance;
