/**
 * 检测原型链污染情况
 */

!(global => { 
  const MSG = '可能被篡改了，要小心哦'
  const inBrowser = typeof window !== 'undefined'

  const {JSON:{parse,stringify},setTimeout,setInterval} = global
  let _snapshots = {
    JSON:{
      parse,
      stringify
    },
    setTimeout,
    setInterval,
    fetch
  }
  if(inBrowser){
    let {localStorage:{getItem,setItem},fetch} = global
    _snapshots.localStorage = {getItem,setItem}
    _snapshots.fetch = fetch
  }
  let _protytypes = {}

  const names = 'Promise,Array,Date,Object,Number,String'.split(",")

  names.forEach(name=>{
    let fns = Object.getOwnPropertyNames(global[name].prototype)
    fns.forEach(fn=>{
      _protytypes[`${name}.${fn}`] = global[name].prototype[fn]
    })
  })

  global.checkNative = function (reset=false){
    for (const prop in _snapshots) {
      if (_snapshots.hasOwnProperty(prop) && prop!=='length') {
        let obj = _snapshots[prop]
        if(typeof obj==='function'){
          const isEqual = _snapshots[prop]===global[prop]
          if(!isEqual){
            console.log(`${prop}${MSG}`)
            if(reset){
              window[prop] = _snapshots[prop]
            }
          }
        }else{
          for(const key in obj){
            const isEqual = _snapshots[prop][key]===global[prop][key]
            if(!isEqual){
              console.log(`${prop}.${key}${MSG}`)
              if(reset){
                window[prop][key] = _snapshots[prop][key]
              }
            }
          }
        }

      }
    }
    
    names.forEach(name=>{
      let fns = Object.getOwnPropertyNames(global[name].prototype)
      fns.forEach(fn=>{
        const isEqual = global[name].prototype[fn]===_protytypes[`${name}.${fn}`]
        if(!isEqual){
          console.log(`${name}.prototype.${fn}${MSG}`)
          if(reset){
            global[name].prototype[fn]=_protytypes[`${name}.${fn}`]
          }
        }
      })
    })
  }
})((0, eval)('this'))
