var qbo = require('./qbo.js')

var customer = {qbCustomer: {parents:[{lastName:'Mansell'},{lastName:'Martin'}]}}
qbo.findCustomerCandidates(customer).then(result => console.log(result))