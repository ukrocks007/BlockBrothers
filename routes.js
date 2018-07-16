const routes = require('next-routes')();

routes
  .add('/insurance/new/:address', '/insurance/new')
  .add('/insurance/insurancePlan', '/insurance/insurancePlan/index')
  .add('/insurance/:address', '/insurance/show')
  .add('/claimsApprover/', '/claimsApprover/index')
  .add('/claimsApprover/show/:id', '/claimsApprover/show')
  .add('/claimsApprover/approve/:address', '/claimsApprover/approve');

module.exports = routes;
