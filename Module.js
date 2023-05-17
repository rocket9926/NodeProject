// console.log(arguments)

// console.log(require('module').wrapper);

// Export Module

const C =require ('./Text-Module1');

const calc1=new C();

console.log(calc1.divide(12,4))

// Export 

// const calc2 = require('./Text-Module2');
// console.log(calc2.add(13,6))

const {add,multiply,divide} =require('./Text-Module2');
console.log(add(13,6))
console.log(multiply(13,6))
console.log(divide(13,6))

// Caching

require('./Text-Module3')();
require('./Text-Module3')();
require('./Text-Module3')();
