import Observable from './util/observable'
import point from './util/point'
import mouse from './mouse'
import finger from './finger'
import combined from './combined'
import _times from 'lodash.times'
import loop from './util/loop'
import {
    rotate, getAngle, norm, rand, diff, times, add, sign
} from '../util/algebra'

let fireflyToPoint = firefly => point(firefly.position, firefly.node, 'firefly')

let firefly = () => {
  const subscription = combined([mouse, finger]).subscribe(
      ({coords}) => { o.destination = coords }
    )
  const node = new window.Image()
  node.src = 'http://www.svgcuts.com/fsvgfotw/2012/svgcuts_2012_06_29.png'
  node.style.position = 'fixed'
  node.style.width = '3vw'
  node.style.minWidth = '20px'
  let o = {
    position: [rand(window.innerWidth), rand(window.innerHeight)],
    destination: [window.innerWidth / 2, window.innerHeight / 2],
    turnSpeed: (3 * Math.PI / 2) / 1000,
    vspeed: [0.15, 0.15],
    node,
    remove: () => {
      document.body.removeChild(node)
      subscription.unsubscribe()
    }
  }

  return o
}

export default new Observable(observer => {
  let fireflies = _times(40, firefly)
  let engine = loop(dt => {
    fireflies.forEach(firefly => {
      let {destination, position, node, turnSpeed, vspeed} = firefly
      let direction = diff(destination, position)
      let angle = getAngle(direction) - getAngle(vspeed)

      if (Math.abs(angle) > Math.PI) angle -= sign(angle) * 2 * Math.PI

      let newVspeed = rotate(
        vspeed,
        sign(angle) * Math.min(dt * turnSpeed, Math.abs(angle))
      )

      if (norm(direction) > 10) {
        firefly.vspeed = newVspeed
        firefly.position = add(position, times(newVspeed, dt))

        node.style.left = `${firefly.position[0]}px`
        node.style.top = `${firefly.position[1]}px`
        node.style.transform = `rotate(${getAngle(newVspeed) + 90}deg)`
      } else {
        firefly.destination = [window.innerWidth, window.innerHeight].map(rand)
      }
    })
    observer.next(fireflyToPoint(fireflies[rand(fireflies.length)]))
  })

  fireflies.forEach(({node}) => document.body.appendChild(node))
  engine.start()

  return () => {
    engine.stop()
    fireflies.forEach(f => f.remove())
  }
})
