var config = require('../config.js')

var InvoiceGenerator = function() {
    var invoiceService = this;

    this.buildWSTRegistrationCustomer = function(wstReg) {
        var parentNames = buildParentNames(wstReg)
        var customerObj =  {
            "BillAddr": {
                "Line1": wstReg.AddressLine1,
                "City": wstReg.AddressCity,
                "Country": "USA",
                "CountrySubDivisionCode": wstReg.AddressState,
                "PostalCode": wstReg.AddressZipCode
            },
            "GivenName": parentNames,
            "FamilyName": wstReg.FamilyName,
            "FullyQualifiedName": parentNames,
            "DisplayName": parentNames,
            "PrintOnCheckName": parentNames,
            "PrimaryPhone": {
                "FreeFormNumber": wstReg.HomePhone
            },
            "PrimaryEmailAddr": {
                "Address": wstReg.parents[0].email
            }
        }
        if(wstReg.AddressLine2.trim() != '') {
            customerObj.BillAddr.Line2 = wstAddressLine2
        }
        return { qbCustomer: customerObj, metaData: {parents: wstReg.parents}}
    }

    this.buildWSTRegistrationInvoice = function(wstReg, customerRef) {
        var invoice = {
            AllowOnlineCreditCardPayment: true,
            AllowOnlineACHPayment: true,
            Line: [], 
            BillEmail: {
                Address: wstReg.parents[0].email
            },
            CustomerMemo: {
                value: "Hello - your invoice for Woodlands Swim Team " + config.season + " registration is ready.\nThanks!"
              },
            CustomerRef: customerRef
        }
        var includeCabanaClub = false
        var youthCount = 0;
        wstReg.athletes.forEach(kid => {
            switch(kid.athleteGroup.trim()) {
                case "Youth":
                    includeCabanaClub = true
                    youthCount++
                    invoice.Line.push(generateYouthLineItem(kid, youthCount))
                    break;
                case "Kermit":
                    invoice.Line.push({
                        "Description": "WST Kermit's fee for " + kid.firstName + " " + kid.lastName,
                        "Amount": 345.00,
                        "DetailType": "SalesItemLineDetail",
                        "SalesItemLineDetail": {
                          "ItemRef": {
                            "value": "49",
                            "name": "WST Kermits"
                          },
                          "Qty": 1
                        }
                      })
                    break;
                case "15-18 age - Cabana Club": //15-18 age - Cabana Club
                includeCabanaClub = true
                invoice.Line.push({
                    "Description": "WST swimmer fee for 15-18 year old club member (" + kid.firstName + " " + kid.lastName + ")",
                    "Amount": 150.00,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                      "ItemRef": {
                        "value": "59",
                        "name": "WST 15-18 Fee"
                      },
                      "Qty": 1
                    }
                  })
                    break;
                case "15-18 age - Non Cabana Club":
                invoice.Line.push({
                    "Description": "WST swimmer fee for 15-18 year old non club member (" + kid.firstName + " " + kid.lastName + ")",
                    "Amount": 250.00,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                      "ItemRef": {
                        "value": "52",
                        "name": "WST15-18 Fee (NC)"
                      },
                      "Qty": 1
                    }
                  })
                    break;
                default:
                  console.log("Error:  Unrecognized AthleteGroup: --" + kid.athleteGroup +"--")
            }
        })

        if(includeCabanaClub) {
            invoice.Line.push({
                "Description": "Club Family Membership",
                "Amount": 600.00,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {
                  "ItemRef": {
                    "value": "56",
                    "name": "CCFamilyMemb"
                  },
                  "Qty": 1
                }
              })
              invoice.Line.push({
                "Description": "Club Annual Maintenance Levy",
                "Amount": 150.00,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {
                  "ItemRef": {
                    "value": "26",
                    "name": "CCMaint"
                  },
                  "Qty": 1
                }
              })
        }
        return invoice
    }

    function generateYouthLineItem(kid, youthCount) {
        var lineItem
        switch(youthCount) {
            case 1:
                lineItem = {
                    "Description": "WST Youth swimmer fee for first athlete (" + kid.firstName + " " + kid.lastName + ")",
                    "Amount": 295.00,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                      "ItemRef": {
                        "value": "50",
                        "name": "WST Regular Swimmer 1"
                      },
                      "Qty": 1
                    }
                  }
                break;
            case 2:
                lineItem = {
                    "Description": "WST Youth swimmer fee for second athlete (" + kid.firstName + " " + kid.lastName + ")",
                    "Amount": 295.00,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                    "ItemRef": {
                        "value": "68",
                        "name": "WST Regular Swimmer 2"
                      },
                      "Qty": 1
                    }
                }
            break;
            default:
                lineItem = {
                    "Description": "WST Youth swimmer fee for " + (youthCount == 3 ? "3rd" : youthCount+"th") + " athlete (" + kid.firstName + " " + kid.lastName + ")",
                    "Amount": 245.00,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "69",
                            "name": "WST Regular Swimmer 3"
                        },
                        "Qty": 1
                    }
                }
    }
        return lineItem
    }
    function hasAthleteGroup(wstReg, groupName) {
        var hasGroup = false
        wstReg.athletes.forEach(kid => {
            if(kid.athleteGroup === groupName) hasGroup = true
        })
        return hasGroup
    }

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
    
}

module.exports = new InvoiceGenerator();
