const _SUB = {}
const SUB = run => ({ _SUB, run })
const DEL = {}
const PUSH = '~' + Date.now()

const assign = Object.assign || ((a, b) => (Object.keys(b).forEach(k => (a[k] = b[k])), a))

const merge = (source, ...patches) => {
  const isArr = Array.isArray(source)
  let res = isArr ? source.slice() : assign({}, source)
  for (const patch of patches) {
    const type = typeof patch
    if (patch && type === 'object') {
      if (patch._SUB === _SUB) res = patch.run
      else {
        for (let k of Object.keys(patch)) {
          const val = patch[k]
          if (isArr && k === PUSH) k = res.length
          if (val == null || typeof val !== 'object' || Array.isArray(val)) res[k] = val
          else if (val === DEL) isArr && !isNaN(k) ? res.splice(k, 1) : delete res[k]
          else if (val._SUB === _SUB)
            res[k] = typeof val.run === 'function' ? val.run(res[k]) : val.run
          else if (typeof res[k] === 'object' && val !== res[k]) res[k] = merge(res[k], val)
          else res[k] = val
        }
      }
    } else if (type === 'function') res = merge(res, patch(res))
  }
  return res
}

export { SUB, DEL, PUSH, merge }
export default merge
