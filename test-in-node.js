const vm = require('vm')
require('./check-native')
require('./evil')

function isNative(fn){
  return fn.toString() === `function ${fn.name}() { [native code] }`
}
let obj = {name:'Illl'}
console.log(obj)
console.log('isNative',isNative(JSON.stringify))
console.log('被污染了',JSON.stringify(obj)) 

let sandbox = {}
vm.runInNewContext(`ret = JSON.stringify({name:'Illl'})`,sandbox)
console.log('vm创建的沙箱环境',sandbox)

console.log('*'.repeat(20))

checkNative(true)
console.log('checkNative重置了',JSON.stringify(obj)) 
