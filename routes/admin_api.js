var importer = require('../import/import_service.js')
var invoicer = require('../invoice/invoice_service.js')
var express = require('express')
var router = express.Router()

router.get('/import/wst', function(req,res) {
  importer.importWSTRegistrationFile(req.query.filename)
    .then(result => res.json(result))
    .catch(err => res.json({error: err, message: 'Error importing WST Registrations'}))
})

router.get('/invoice/wst', function(req,res) {
  invoicer.processWSTRegistrations(req)
    .then(result => res.json(result))
    .catch(err => res.json({error: err, message: 'Error processing WST invoicing'}))
})

router.get('/invoice/cc', function(req,res) {
  invoicer.queryQuickBooks(req)
    .then(result => res.json(result))
    .catch(err => res.json({error: err, message: 'Error processing CC invoicing'}))
})

router.get('/queryQB', function(req,res) {
  invoicer.queryQuickBooks(req, unescape(req.query.sql))
    .then(result => res.json(result))
    .catch(err => res.json({error: err, message: 'Error processing QB query'}))
})

module.exports = router
