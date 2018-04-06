/*
console.log(/^([a-z0-9]{5,})$/.test('abc1'))

console.log(/^([a-z0-9]{5,})$/.test('abc12'))

console.log(/^([a-z0-9]{5,})$/.test('abc123'))


console.log(/(^|\s)Ho($|\s|\,)/.test('Ho, '))
*/


//console.log(/[^a-zA-Z0-9|$]Ho[^a-zA-Z0-9]/.test('Ho, Peter'))

//console.log(/(^|\s|[^a-zA-Z0-9])Ho($|\s|\,)/.test(':Ho'))
//console.log(/(^|[^a-zA-Z0-9])Ho($|[^a-zA-Z0-9])/.test(';Hoe,'))

//var regex = new RegExp('(^|[^a-zA-Z0-9])' + 'Ho' + '($|[^a-zA-Z0-9])')
/*
console.log('test: ' + containsName('John Hock : Bob & Sue','Ho'))
console.log('test: ' + containsName('HO','Ho'))
console.log('test: ' + containsName('HO, Peter','Ho'))
*/

var existing = {DisplayName: ' Ho  Betty & Charles:Peter,:'}
var parent = {firstName: 'Peter', lastName: 'Ho'}

if(containsName(existing.DisplayName, parent.firstName) 
&& containsName(existing.DisplayName, parent.lastName)) {
    console.log('Customer matched on name: ' + parent.firstName + ' ' + parent.lastName)
} else {
    console.log('No customer match')
}

var set1 = new Set()
set1.add('mansell').add('martin').add('mansell').add('mansell')
console.log(set1)


function nameRegEx(name) {
    return new RegExp('(^|[^a-zA-Z0-9])' + name + '($|[^a-zA-Z0-9])','i')
}

function containsName(str, name) {
    return nameRegEx(name).test(str)
}