var extractValues = require("extract-values")

console.log(extractValues('Mike Mansell <mike@mano.com>'.replace('<>','<none>'), "{firstName} {lastName} <{email}>"))


console.log(upperFirstChar("mansell"))
console.log(upperFirstChar("Martin"))

function upperFirstChar(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}