import raf, {cancel} from 'raf'
import now from 'present'

export default function loop (fn) {
  let handle
  return {
    start: () => {
      let last = now()
      handle = raf(function update () {
        let current = now()
        fn(Math.min(current - last, 500))
        last = current
        handle = raf(update)
      })
    },
    stop: () => cancel(handle)
  }
};
