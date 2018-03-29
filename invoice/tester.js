
var invoiceService = require('./invoice_service.js')

invoiceService.processWSTRegistrations().then(result => console.log(result))

/*
var wstReg = {}
wstReg.parents = []
wstReg.parents.push({"firstName":"Luke","lastName":"Howarter"})
wstReg.parents.push({"firstName":"Bob","lastName":"Snider"})
wstReg.parents.push({"firstName":"Sue","lastName":"Howarter"})

console.log(buildParentNames(wstReg))

function buildParentNames(wstReg) {
    var pMap = new Map()
    wstReg.parents.forEach(parent => {
        if(pMap.get(parent.lastName) === undefined) {
            pMap.set(parent.lastName, parent.firstName)
        } else {
            pMap.set(parent.lastName, pMap.get(parent.lastName) + ' & ' + parent.firstName)
        }
    })
    var parentNames = ''
    pMap.forEach(function(value, key) {
        if(parentNames == '') {
            parentNames = value + ' ' + key
        } else {
            parentNames = parentNames + ' and ' + value + ' ' + key
        }
    });
    return parentNames
}

*/
/*
var gen = require('./wst_invoice_generator.js')
var firebaseDB = require('../storage/firebaseDB.js')

console.log('starting')
firebaseDB.getWSTRegistration('1952')
  .then(doc => {
      console.log('inslide')

    doc.athletes.push({"firstName":"Luke","lastName":"Howarter","age":"8","athleteGroup":"Youth"})
    doc.athletes.push({"firstName":"Luke","lastName":"Howarter","age":"8","athleteGroup":"Youth"})
    doc.athletes.push({"firstName":"Luke","lastName":"Howarter","age":"8","athleteGroup":"Youth"})
    doc.athletes.push({"firstName":"Luke","lastName":"Howarter","age":"8","athleteGroup":"Youth"})
      var inv = gen.buildWSTRegistrationCustomer(doc)
      console.log(inv)
     
    console.log(doc)
    console.log(gen.buildWSTRegistrationCustomer(doc))
    })
*/