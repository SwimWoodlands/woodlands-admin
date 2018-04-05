var firebase = require('firebase-admin');
var secrets = require('../secrets.js');
var config = require('../config.js');

var FirebaseDB = function() {
    var firebaseDB = this;

    console.log('Firebase apiKey: ' + secrets.apiKey)
    firebase.initializeApp({
        apiKey: secrets.apiKey,
        authDomain: "woodlands-api.firebaseapp.com",
        databaseURL: "https://woodlands-api.firebaseio.com",
        projectId: "woodlands-api",
        storageBucket: "woodlands-api.appspot.com",
        messagingSenderId: secrets.messagingSenderId
      });
    
    console.log('Initializing Firebase')
    var wstRegDB = firebase.firestore().collection('wst-membership-'+config.season);
    
    this.createWSTRegistration = function(regData) {
        return new Promise(function(resolve,reject){
            wstRegDB.doc(regData.RegistrationNumber).get()
                .then(doc => {
                    if (!doc.exists) {
                        regData.invoiced = false;
                        wstRegDB.doc(regData.RegistrationNumber).set(regData)
                            .then(pDoc => resolve({status: 'created', family: regData.FamilyName}))
                            .catch(err => reject({status: 'error', error: err}))
                    } else {
                        resolve({status: 'ignored', family: regData.FamilyName})
                    }
                })
                .catch(err => reject({status: 'error', error: err}))
            })
    }

    this.getWSTRegistration = function(regId) {
        return new Promise(function(resolve,reject){
            wstRegDB.doc(regId).get()
                .then(doc => {
                    if (!doc.exists) {
                        reject("Does not exist")
                    } else {
                        resolve(doc.data())
                    }
                })
                .catch(err => reject({status: 'error', error: err}))
        })
    }

    this.markWSTRegistrationInvoiced = function(wstReg, qbInvoice) {
        if(config.testrun) {
            return Promise.resolve({registration: wstReg, type: 'WST', qbInvoice: qbInvoice})
        } else {
            wstRegDB.doc(wstRegDoc.id).set({invoiced: true, qbInvoiceId: qbInvoice.Id}, {merge: true})
            .then(_ => {
                return {registration: wstReg, type: 'WST', qbInvoice: qbInvoice}
            })
        }
    }

     this.getUnInvoicedWSTRegistrations = function() {
        return new Promise(function(resolve,reject){
            wstRegDB.where('invoiced', '==', false).limit(1).get()
            .then(snapshot => {
                docs = []
                snapshot.forEach(doc => docs.push(doc.data()))
                resolve(docs)
            })
        })
    }
}

module.exports = new FirebaseDB();
