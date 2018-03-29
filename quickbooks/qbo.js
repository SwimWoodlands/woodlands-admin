var tools = require('../tools/tools.js')
var config = require('../config.js')
var request = require('request')


var QBO = function () {
    var qbo = this

    this.setRequest = function(Req) {
        qbo.httpReq = Req
    }

    this.getItemMap = function() {
        return qbo.queryAPI("select Id, Name from Item")
            .then(resp => { return resp.QueryResponse.Item})
            .then(items => {
                var itemMap = new Map()
                items.forEach(item => {
                    itemMap.set(item.Name, {Id: item.Id, Name: item.Name})
                })
                return itemMap
            })
    }
    
    this.upsertCustomer = function(customer) {
        return qbo.queryAPI("select * from customer where DisplayName like '%"+customer.qbCustomer.FamilyName+"%'")
        .then(result => matchCustomers(customer, result))
        .then(matchResult => {
            if(matchResult.isNewCustomer){
                return qbo.createCustomer(customer.qbCustomer)
            } else if(matchResult.hasUpdates){
                return qbo.updateCustomer(matchResult.updatedCustomer)
            } else {
                return matchResult.matchedCustomer
            }
        })
    }

    function matchCustomers(customer, res) {
        console.log('inside matchCustomers')
        var result = {isNewCustomer: true}
        if('Customer' in res.QueryResponse) {
            var customers = res.QueryResponse.Customer
            for (i = 0; i < customers.length; i++) { 
                custMatch = matchCustomer(customer, customers[i])
                if(custMatch.isMatch) {
                    result.isNewCustomer = false
                    if(custMatch.hasUpdates){
                        result.hasUpdates = true
                        result.updatedCustomer = custMatch.update
                    } else {
                        result.hasUpdates = false
                        result.matchedCustomer = customers[i]
                    }
                    break;
                }
            }
        }
        return result
    }

    function matchCustomer(customer, existing) {
        console.log('inside matchCustomer')
        var newRecord = customer.qbCustomer
        var newParents = customer.metaData.parents
        var result = {isMatch: false, hasUpdates: true, update: existing}

        for (i = 0; i < newParents.length; i++) {
            var parent = newParents[i]
            if(parent.email == existing.PrimaryEmailAddr.Address) {
                result.isMatch = true
                console.log('Customer matched on email: ' + parent.email)
                mergeCustomer(newRecord, result.update)
                return result
            }
        }
        if(newRecord.PrimaryPhone.FreeFormNumber == existing.PrimaryPhone.FreeFormNumber) {
            result.isMatch = true
            console.log('Customer matched on Phone Number: ' + newRecord.PrimaryPhone.FreeFormNumber)
            mergeCustomer(newRecord, result.update)
            return result
        }
        if(newRecord.BillAddr.Line1 == existing.BillAddr.Line1) {
            result.isMatch = true
            console.log('Customer matched on Address: ' + newRecord.BillAddr.Line1)
            mergeCustomer(newRecord, result.update)
            return result
        }
        for (i = 0; i < newParents.length; i++) {
            var parent = newParents[i]
            if(existing.DisplayName.includes(parent.firstName)) {
                result.isMatch = true
                console.log('Customer matched on name: ' + parent.firstName + ' ' + parent.lastName)
                mergeCustomer(newRecord, result.update)
                return result
            }
        }
        return result
    }

    function mergeCustomer(newCustomer, existing) {
        for (var attrname in newCustomer) { existing[attrname] = newCustomer[attrname] }
    }

    this.createInvoice = function(qbInvoice){
        console.log('inside createInvoice')
        console.log(JSON.stringify(qbInvoice))
        return writeQBObject(qbInvoice, 'invoice', false)
        .then(res => {
            return res.Invoice
        })
    }

    this.createCustomer = function(qbCustomer){
        console.log('inside createCustomer')
        return writeQBObject(qbCustomer, 'customer', false)
        .then(res => {
            return res.Customer
        })
    }

    this.updateInvoice = function(qbInvoice){ 
        console.log('inside updateInvoice')
        return writeQBObject(qbInvoice, 'invoice', true)
        .then(res => {
            return res.Invoice
        })
    }

    this.updateCustomer = function(qbCustomer){
        console.log('inside updateCustomer')
        return writeQBObject(qbCustomer, 'customer', true)
            .then(res => {
                return res.Customer
            })
        }

    function writeQBObject(qbObject, qbType, isUpdate) {
        console.log('inside writeQBObject')
/*
        if(config.testrun) { 
            var result = {}
            qbObject.Id = '8'
            result[qbType == 'invoice' ? 'Invoice':'Customer'] = qbObject;
            console.log(result)
            return Promise.resolve(result)
        }
*/        
        return new Promise(function(resolve,reject){
            var req = qbo.httpReq
            var token = tools.getToken(req.session)
            if(!token) return reject(new Error(({error: 'Not authorized'})))
          
            var url = config.api_uri + req.session.realmId + '/' + qbType
            if(isUpdate) { url = url + '?operation=update'}

            request({
              url: url,
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + token.accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(qbObject)
            }, function (err, response, body) {
              if(err || response.statusCode != 200) {
                  console.log('Error updating Quickbooks')
                reject(new Error({error: err, statusCode: response.statusCode}))
              }
              var resp = JSON.parse(body)
              console.log(resp)
              resolve(resp)
            })
        })
    }

    this.queryAPI = function(queryStr) {
        console.log('qbo.queryAPI('+queryStr+')')
        return new Promise(function(resolve,reject){

            var httpReq = qbo.httpReq

            if(!httpReq) reject(new Error('Http Req object not available'))
            var token = tools.getToken(httpReq.session)
            if(!token) reject(new Error("{error: 'Not authorized'}"))
            if(!httpReq.session.realmId) reject(new Error({
              error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
            }));

            var token = tools.getToken(httpReq.session)
            if(!token) reject(new Error("{error: 'Not authorized'}"));
            if(!httpReq.session.realmId) reject(new Error({
              error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
            }));

            var requestObj = {
              url: config.api_uri + httpReq.session.realmId + '/query?query=' + encodeURIComponent(queryStr),
              headers: {
                'Authorization': 'Bearer ' + token.accessToken,
                'Accept': 'application/json'
              }
            }
      
            // Make API call
            request(requestObj, function (err, response) {
              // Check if 401 response was returned - refresh tokens if so!
              tools.checkForUnauthorized(httpReq, requestObj, err, response).then(function ({err, response}) {
                if(err || response.statusCode != 200) {
                  reject(new Error({error: err, statusCode: response.statusCode}))
                }
          
                // API Call was a success!
                resolve(JSON.parse(response.body))
              }, function (err) {
                console.log(err)
                reject(err)
              })
            })
        })
    
    }

}

module.exports = new QBO()