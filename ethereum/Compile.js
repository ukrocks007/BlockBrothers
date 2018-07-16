const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

process.stdout.write("Compiling");

const buildPath = path.resolve(__dirname, 'Build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'Contract', 'InsuranceContracts.sol');

console.log(campaignPath);

const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  console.log(contract);
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
