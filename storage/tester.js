var firebaseDB = require('./firebaseDB.js')

firebaseDB.getUnInvoicedWSTRegistrations().then(docs => {
    docs.forEach(doc => console.log('Process for family: ' + doc.FamilyName))
})

