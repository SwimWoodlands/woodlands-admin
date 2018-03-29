var firebaseDB = require('../storage/firebaseDB.js')
var qbo = require('../quickbooks/qbo.js')
var wstGenerator = require('./wst_invoice_generator.js')

var InvoiceService = function () {
    var invoiceService = this;

    this.processWSTRegistrations = function(httpReq) {
        qbo.setRequest(httpReq)

/*        
        qbo.getItemMap().then(itemMap => {
            return {itemMap: itemMap, wstRegs: firebaseDB.getUnInvoicedWSTRegistrations()}})
              .then(ready => {
                  var wstRegs = ready.wstRegs
*/                  
        return firebaseDB.getUnInvoicedWSTRegistrations()
            .then(wstRegs => {
                console.log('processWSTRegistration should have ' + wstRegs.length + ' registrations to process')
                var pending = []
                wstRegs.forEach(wstReg => pending.push(processWSTRegistration(wstReg)))
                console.log('processWSTRegistrations has ' + pending.length + ' pending registrations')
                return Promise.all(pending)
            })
    }

    function processWSTRegistration(wstReg) {
        console.log('invoice_service.processWSTRegistration called for family ' + wstReg.FamilyName)
        return qbo.upsertCustomer(wstGenerator.buildWSTRegistrationCustomer(wstReg))
        .then(customer => { 
            return {value: customer.Id}
        })
        .then(customerRef => qbo.createInvoice(wstGenerator.buildWSTRegistrationInvoice(wstReg, customerRef)))
        .then(qbInvoice => firebaseDB.markWSTRegistrationInvoiced(wstReg, qbInvoice))
        .then(result => {
            return {family: result.registration.FamilyName, qbInvoiceId: result.qbInvoice.Id}
        })
    }

    this.processCCRegistrations = function(httpReq) {
        return Promise.resolve({ccNewInvoiceCount: 5})
    }

    this.queryQuickBooks = function(httpReq, query) {
        qbo.setRequest(httpReq)
        console.log("message: " + httpReq.query.sql)
        return qbo.queryAPI(query)
    }
}  

module.exports = new InvoiceService();
