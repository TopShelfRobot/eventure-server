const EventEmitter = require('events').EventEmitter
const isObject = require('lodash/isObject')
const isArray = require('lodash/isArray')
const isDate = require('lodash/isDate')

const notObject = o => !isObject(o) || isDate(o)
const notArray = a => !isArray(a)


const eventFns = [
  "on", "removeListener", "once", "removeAllListeners", "listeners", 
  "listenerCount", "_events", "_eventsCount" 
]


const observable = obj => {
  const events = new EventEmitter()

  const wrap = (target, name, value) => {
    if (notObject(value) && notArray(value)) return value
    if (value.__isObservable) return value

    const obs = observable(value)
    obs.on("changed", (nTarget, nName, nOld, nNew) => {
      events.emit("changed", target, `${name}.${nName}`, nOld, nNew )
    })

    return obs
  }

  const handler = {
    get: (target, name) => {
      if (eventFns.includes(name)) return events[name] 
      if (name === '__isObservable') return true
      return wrap(target, name, target[name])
    },

    set: (target, name, newValue) => {
      if (eventFns.includes(name)) return events[name] = newValue
      const oldValue = target[name]
      target[name] = wrap(target, name, newValue)
      events.emit("changed", target, name, oldValue, newValue)
      return true
    }
  }

  const p = new Proxy(obj, handler)
  return p
}

module.exports = observable