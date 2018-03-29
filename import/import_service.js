var parse = require('csv-parse');
var fs = require('fs');
var extractValues = require("extract-values");
var firebaseDB = require('../storage/firebaseDB.js')

var ImportService = function () {
    var importService = this;

    this.importWSTRegistrationFile = function(csvFile) {
        return new Promise(function(resolve,reject){
            fs.readFile(csvFile, 'utf8', function (err,data) {
                if (err) reject({error: err, message: 'Failed to read file'})
                parse(data, {columns: function (headerLine) {
                    return headerLine.map(h => h.replace(/[\s,\/]/g,'').replace(/[\(,\)]/g,'_'))
                } }, function(err, output){
                    if (err) reject({error: err, message: 'Failed to parse csv file'})
                    var pending = []
                    output.forEach(reg => {
                        reg.parents = parseParentInfo(reg);
                        reg.athletes = parseAthleteInfo(reg);
                        pending.push(firebaseDB.createWSTRegistration(reg))
                    })                    
                    Promise.all(pending).then(function(results) {
                        var ignored = 0
                        var created = 0
                        var errors = 0
                        results.forEach(r => {
                            if(r.status == 'created') created++
                            if(r.status == 'ignored') ignored++
                            if(r.status == 'error') errors++
                        })
                        resolve({created: created, ignored: ignored, errors: errors, details: results})
                    });
                })
            })
        })
    }

    function parseParentInfo(registration) {
        var parents = [];
        var parentList = registration.ParentNames.split('\r');
        var count = 0;
        parentList.forEach(parentData => {
            parents[count++] = extractValues(parentData.replace('<>','<none>'), "{firstName} {lastName} <{email}>")
        });
        return parents;
    }
    
    function parseAthleteInfo(registration) {
        var athletes = [];
        var athleteList = registration.AthleteNames_Age_.split('\r');
        var count = 0;
        athleteList.forEach(athleteData => {
            athletes[count++] = extractValues(athleteData, "{firstName} {lastName} ({age}) - {athleteGroup}")
        });
        return athletes;
    }

}  

module.exports = new ImportService();
