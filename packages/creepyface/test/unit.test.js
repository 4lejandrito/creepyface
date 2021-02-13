import simulateEvent from 'simulate-event'
import creepyface from '../src/creepyface'

const createElement = (string) => {
  const div = document.createElement('div')
  div.innerHTML = string
  return div.children[0]
}

const beforeAndAfter = (fn) => {
  let cancel
  beforeEach(() => {
    cancel = fn()
  })
  afterEach(() => {
    cancel && cancel()
  })
}

const withImage = (getImage) => {
  const img = createElement(getImage())
  beforeAndAfter(() => {
    document.body.appendChild(img)
    return () => img.remove()
  })
  return img
}

const createGetNewSrc = (img, providePoint) => (point) => {
  providePoint(point)
  jest.advanceTimersByTime(50)
  return img.src
}

const withCreepyfaceRegistered = (registerCreepyface) => {
  beforeAndAfter(() => {
    const unregisterCreepyface = registerCreepyface()
    jest.advanceTimersByTime(1)
    return unregisterCreepyface
  })
}

const isDeactivated = (img, providePointArray) => {
  it('uses the original src', () =>
    expect(img.src).toBe('http://localhost/serious'))

  it('does not follow the points', () => {
    providePointArray.forEach((providePoint) => {
      const getNewSrc = createGetNewSrc(img, providePoint)
      expect(getNewSrc([0, 0])).toBe('http://localhost/serious')
      expect(getNewSrc([0, -1])).toBe('http://localhost/serious')
      expect(getNewSrc([1, -1])).toBe('http://localhost/serious')
      expect(getNewSrc([1, 0])).toBe('http://localhost/serious')
      expect(getNewSrc([1, 1])).toBe('http://localhost/serious')
      expect(getNewSrc([0, 1])).toBe('http://localhost/serious')
      expect(getNewSrc([-1, 1])).toBe('http://localhost/serious')
      expect(getNewSrc([-1, 0])).toBe('http://localhost/serious')
      expect(getNewSrc([-1, -1])).toBe('http://localhost/serious')
    })
  })

  it('does not have private data', () => {
    expect(img.__creepyfaceCancel).toBeUndefined()
    expect(img.__creepyfaceReachableImages).toBeUndefined()
  })
}

const testPoints = (img, providePoint, skipHover) => {
  const getNewSrc = createGetNewSrc(img, providePoint)

  it('preloads and caches every image to avoid flickering when they load', () => {
    const preloadedSrcs = img.__creepyfaceReachableImages.map((img) => img.src)
    expect(preloadedSrcs).toContain('http://localhost/serious')
    if (!skipHover) {
      expect(preloadedSrcs).toContain('http://localhost/hover')
    }
    expect(preloadedSrcs).toContain('http://localhost/north')
    expect(preloadedSrcs).toContain('http://localhost/northEast')
    expect(preloadedSrcs).toContain('http://localhost/east')
    expect(preloadedSrcs).toContain('http://localhost/southEast')
    expect(preloadedSrcs).toContain('http://localhost/south')
    expect(preloadedSrcs).toContain('http://localhost/southWest')
    expect(preloadedSrcs).toContain('http://localhost/west')
    expect(preloadedSrcs).toContain('http://localhost/northWest')
  })

  it('keeps the original src', () =>
    expect(img.src).toBe('http://localhost/serious'))

  if (!skipHover) {
    it('uses the hover image when the point overlaps with the image', () => {
      expect(getNewSrc([0, 0])).toBe('http://localhost/hover')
      jest.advanceTimersByTime(1000)
      document.elementFromPoint = (x, y) =>
        x === 0 && y === 0 ? img : document
      expect(getNewSrc([0, 0])).toBe('http://localhost/hover')
      delete document.elementFromPoint
    })
  }

  it('follows the points', () => {
    expect(getNewSrc([0, -1])).toBe('http://localhost/north')
    expect(getNewSrc([1, -1])).toBe('http://localhost/northEast')
    expect(getNewSrc([1, 0])).toBe('http://localhost/east')
    expect(getNewSrc([1, 1])).toBe('http://localhost/southEast')
    expect(getNewSrc([0, 1])).toBe('http://localhost/south')
    expect(getNewSrc([-1, 1])).toBe('http://localhost/southWest')
    expect(getNewSrc([-1, 0])).toBe('http://localhost/west')
    expect(getNewSrc([-1, -1])).toBe('http://localhost/northWest')
  })

  describe('after a second with no points', () => {
    beforeAndAfter(() => {
      expect(getNewSrc([0, -1])).toBe('http://localhost/north')
      jest.advanceTimersByTime(1000)
    })

    it('uses the original src', () =>
      expect(img.src).toBe('http://localhost/serious'))
  })

  describe('after unregistering creepyface', () => {
    beforeAndAfter(() => {
      creepyface.cancel(img)
    })

    isDeactivated(img, [providePoint])
  })
}

const provideMousePoint = (point) =>
  simulateEvent.simulate(document, 'mousemove', {
    clientX: point[0],
    clientY: point[1],
  })
const followsTheMouse = (img, skipHover) =>
  describe('follows the mouse pointer', () => {
    testPoints(img, provideMousePoint, skipHover)
  })

const provideTouchPoint = (point) =>
  document.dispatchEvent(
    new TouchEvent('touchmove', {
      touches: [{ clientX: point[0], clientY: point[1] }],
    })
  )
const followsTheFinger = (img, skipHover) =>
  describe('follows the finger', () => {
    testPoints(img, provideTouchPoint, skipHover)
  })

const followsThePointer = (img, skipHover) => {
  followsTheMouse(img, skipHover)
  followsTheFinger(img, skipHover)
}

let testConsumer
creepyface.registerPointProvider('custom', (consumer) => {
  testConsumer = (point) => {
    consumer(point)
    jest.advanceTimersByTime(50)
  }
  return () => {
    testConsumer = () => {}
  }
})
const followsTheCustomPointProvider = (img) =>
  describe('follows the custom point provider', () => {
    testPoints(img, (point) => testConsumer(point))

    describe('when a null point is provided', () => {
      beforeAndAfter(() => {
        testConsumer(null)
      })
      it('uses the original src', () =>
        expect(img.src).toBe('http://localhost/serious'))
    })
  })

describe('creepyface', () => {
  beforeAndAfter(() => {
    jest.useFakeTimers()
    return () => jest.useRealTimers()
  })

  describe('when an image fails to load', () => {
    beforeAndAfter(() => {
      jest.spyOn(global, 'Image').mockImplementation(() => {
        const img = {}
        setTimeout(() => img.onload())
        return img
      })
      return () => global.Image.mockRestore()
    })

    beforeAndAfter(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      return () => console.error.mockRestore()
    })

    const img = withImage(
      () => `
        <img src="http://localhost/serious"
          data-creepyface
          data-src-hover="http://localhost/hover"
          data-src-look-0="http://localhost/north"
          data-src-look-45="http://localhost/northEast"
          data-src-look-90="http://localhost/east"
          data-src-look-135="http://localhost/southEast"
          data-src-look-180="http://localhost/south"
          data-src-look-225="http://localhost/southWest"
          data-src-look-270="http://localhost/west"
          data-src-look-315="http://localhost/northWest"
        />
      `
    )

    withCreepyfaceRegistered(() => creepyface(img))

    it('logs an error message', () => expect(console.error).toHaveBeenCalled())

    isDeactivated(img, [provideMousePoint, provideTouchPoint])
  })

  describe('when all the images load', () => {
    beforeAndAfter(() => {
      jest.spyOn(global, 'Image').mockImplementation(() => {
        const img = { naturalWidth: 100 }
        setTimeout(() => img.onload())
        return img
      })
      return () => global.Image.mockRestore()
    })

    describe('including the creepyface script', () => {
      ;['data-creepyface', 'data-creepy'].forEach((attributeName) => {
        describe(`with an image with the ${attributeName} attribute`, () => {
          const img = withImage(
            () => `
              <img src="http://localhost/serious"
                ${attributeName}
                data-src-hover="http://localhost/hover"
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          withCreepyfaceRegistered(() => {
            window.document.dispatchEvent(
              new Event('DOMContentLoaded', {
                bubbles: true,
                cancelable: true,
              })
            )
            return () => creepyface.cancel(img)
          })

          followsThePointer(img)
        })

        describe(`with 2 images with the ${attributeName} attribute`, () => {
          const img1 = withImage(
            () => `
              <img src="http://localhost/serious"
                ${attributeName}
                data-src-hover="http://localhost/hover"
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          const img2 = withImage(
            () => `
              <img src="http://localhost/serious"
                ${attributeName}
                data-src-hover="http://localhost/hover"
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          withCreepyfaceRegistered(() => {
            window.document.dispatchEvent(
              new Event('DOMContentLoaded', {
                bubbles: true,
                cancelable: true,
              })
            )
            return () => {
              creepyface.cancel(img1)
              creepyface.cancel(img2)
            }
          })

          followsThePointer(img1)
          followsThePointer(img2)
        })
      })
    })

    describe('calling creepyface(img, options)', () => {
      describe('with an image without src attribute', () => {
        it('throws an error', () =>
          expect(() => creepyface(document.createElement('img'))).toThrow(
            'A default URL must be specified'
          ))
      })

      describe('with a valid image', () => {
        describe('and no options', () => {
          const img = withImage(
            () => `
              <img src="http://localhost/serious"            
                data-src-hover="http://localhost/hover"
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          withCreepyfaceRegistered(() => creepyface(img))

          followsThePointer(img)
        })

        describe('and no options or data-attributes', () => {
          const img = withImage(
            () => `
              <img src="http://localhost/serious" />                                            />
            `
          )

          withCreepyfaceRegistered(() => creepyface(img))

          it('does nothing', () => {
            const getNewSrc = createGetNewSrc(img, provideMousePoint)
            expect(getNewSrc([0, -1])).toBe('http://localhost/serious')
          })
        })

        describe('and no hover image', () => {
          const img = withImage(
            () => `
              <img src="http://localhost/serious"                            
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          withCreepyfaceRegistered(() => creepyface(img))

          followsThePointer(img, true)
        })

        describe('and no data-attributes', () => {
          const img = withImage(() => '<img src="http://localhost/serious"/>')

          withCreepyfaceRegistered(() =>
            creepyface(img, {
              hover: 'http://localhost/hover',
              looks: [
                { angle: 0 * 45, src: 'http://localhost/north' },
                { angle: 1 * 45, src: 'http://localhost/northEast' },
                { angle: 2 * 45, src: 'http://localhost/east' },
                { angle: 3 * 45, src: 'http://localhost/southEast' },
                { angle: 4 * 45, src: 'http://localhost/south' },
                { angle: 5 * 45, src: 'http://localhost/southWest' },
                { angle: 6 * 45, src: 'http://localhost/west' },
                { angle: 7 * 45, src: 'http://localhost/northWest' },
              ],
            })
          )

          followsThePointer(img)
        })

        describe('and a custom point provider', () => {
          describe('in the options argument', () => {
            const img = withImage(
              () => `
                <img src="http://localhost/serious"            
                  data-src-hover="http://localhost/hover"
                  data-src-look-0="http://localhost/north"
                  data-src-look-45="http://localhost/northEast"
                  data-src-look-90="http://localhost/east"
                  data-src-look-135="http://localhost/southEast"
                  data-src-look-180="http://localhost/south"
                  data-src-look-225="http://localhost/southWest"
                  data-src-look-270="http://localhost/west"
                  data-src-look-315="http://localhost/northWest"
                />
              `
            )

            withCreepyfaceRegistered(() =>
              creepyface(img, { points: 'custom' })
            )

            followsTheCustomPointProvider(img)
          })

          describe('as a string', () => {
            describe('in the options argument', () => {
              const img = withImage(
                () => `
                  <img src="http://localhost/serious"            
                    data-src-hover="http://localhost/hover"
                    data-src-look-0="http://localhost/north"
                    data-src-look-45="http://localhost/northEast"
                    data-src-look-90="http://localhost/east"
                    data-src-look-135="http://localhost/southEast"
                    data-src-look-180="http://localhost/south"
                    data-src-look-225="http://localhost/southWest"
                    data-src-look-270="http://localhost/west"
                    data-src-look-315="http://localhost/northWest"
                  />
                `
              )

              withCreepyfaceRegistered(() =>
                creepyface(img, { points: 'custom' })
              )

              followsTheCustomPointProvider(img)
            })

            describe('in the data-points image attribute', () => {
              const img = withImage(
                () => `
                  <img src="http://localhost/serious"    
                    data-points="custom"        
                    data-src-hover="http://localhost/hover"
                    data-src-look-0="http://localhost/north"
                    data-src-look-45="http://localhost/northEast"
                    data-src-look-90="http://localhost/east"
                    data-src-look-135="http://localhost/southEast"
                    data-src-look-180="http://localhost/south"
                    data-src-look-225="http://localhost/southWest"
                    data-src-look-270="http://localhost/west"
                    data-src-look-315="http://localhost/northWest"
                  />
                `
              )

              withCreepyfaceRegistered(() => creepyface(img))

              followsTheCustomPointProvider(img)
            })
          })
        })

        describe('and an unknown custom point provider', () => {
          beforeAndAfter(() => {
            jest.spyOn(console, 'error').mockImplementation(() => {})
            return () => console.error.mockRestore()
          })

          const img = withImage(
            () => `
              <img src="http://localhost/serious"            
                data-src-hover="http://localhost/hover"
                data-src-look-0="http://localhost/north"
                data-src-look-45="http://localhost/northEast"
                data-src-look-90="http://localhost/east"
                data-src-look-135="http://localhost/southEast"
                data-src-look-180="http://localhost/south"
                data-src-look-225="http://localhost/southWest"
                data-src-look-270="http://localhost/west"
                data-src-look-315="http://localhost/northWest"
              />
            `
          )

          withCreepyfaceRegistered(() => creepyface(img, { points: 'missing' }))

          it('logs an error message', () => {
            expect(console.error).toHaveBeenCalledWith(
              "No point provider registered as 'missing'."
            )
          })

          followsThePointer(img)
        })

        describe('and several point providers', () => {
          describe('in the options argument', () => {
            const img = withImage(
              () => `
                <img src="http://localhost/serious"            
                  data-src-hover="http://localhost/hover"
                  data-src-look-0="http://localhost/north"
                  data-src-look-45="http://localhost/northEast"
                  data-src-look-90="http://localhost/east"
                  data-src-look-135="http://localhost/southEast"
                  data-src-look-180="http://localhost/south"
                  data-src-look-225="http://localhost/southWest"
                  data-src-look-270="http://localhost/west"
                  data-src-look-315="http://localhost/northWest"
                />
              `
            )

            withCreepyfaceRegistered(() =>
              creepyface(img, { points: 'mouse,finger,custom' })
            )

            followsThePointer(img)
            followsTheCustomPointProvider(img)
          })

          describe('in the data-points image attribute', () => {
            const img = withImage(
              () => `
                <img src="http://localhost/serious"    
                  data-points="mouse,finger,custom"        
                  data-src-hover="http://localhost/hover"
                  data-src-look-0="http://localhost/north"
                  data-src-look-45="http://localhost/northEast"
                  data-src-look-90="http://localhost/east"
                  data-src-look-135="http://localhost/southEast"
                  data-src-look-180="http://localhost/south"
                  data-src-look-225="http://localhost/southWest"
                  data-src-look-270="http://localhost/west"
                  data-src-look-315="http://localhost/northWest"
                />
              `
            )
            withCreepyfaceRegistered(() => creepyface(img))

            followsThePointer(img)
            followsTheCustomPointProvider(img)
          })
        })

        describe('and a custom point provider with the onAttach function', () => {
          const img = withImage(() => '<img src="http://localhost/serious"/>')
          let setPointProvider

          withCreepyfaceRegistered(() =>
            creepyface(img, {
              hover: 'http://localhost/hover',
              looks: [
                { angle: 0 * 45, src: 'http://localhost/north' },
                { angle: 1 * 45, src: 'http://localhost/northEast' },
                { angle: 2 * 45, src: 'http://localhost/east' },
                { angle: 3 * 45, src: 'http://localhost/southEast' },
                { angle: 4 * 45, src: 'http://localhost/south' },
                { angle: 5 * 45, src: 'http://localhost/southWest' },
                { angle: 6 * 45, src: 'http://localhost/west' },
                { angle: 7 * 45, src: 'http://localhost/northWest' },
              ],
              onAttach: (args) => (setPointProvider = args.setPointProvider),
            })
          )

          followsThePointer(img)

          describe('and a new point provider is set', () => {
            beforeAndAfter(() => {
              setPointProvider('custom')
            })

            followsTheCustomPointProvider(img)
          })
        })
      })
    })

    describe('calling creepyface.cancel(img) on a random image', () => {
      it('does nothing', () => {
        creepyface.cancel(document.createElement('img'))
      })
    })

    describe('when cancel is called before images load', () => {
      const img = withImage(
        () => `
          <img src="http://localhost/serious"                      
            data-src-hover="http://localhost/hover"
            data-src-look-0="http://localhost/north"
            data-src-look-45="http://localhost/northEast"
            data-src-look-90="http://localhost/east"
            data-src-look-135="http://localhost/southEast"
            data-src-look-180="http://localhost/south"
            data-src-look-225="http://localhost/southWest"
            data-src-look-270="http://localhost/west"
            data-src-look-315="http://localhost/northWest"
          />
        `
      )

      withCreepyfaceRegistered(() => {
        const cancel = creepyface(img)
        cancel()
      })

      isDeactivated(img, [provideMousePoint, provideTouchPoint])
    })

    describe('when timeToDefault is 0', () => {
      const img = withImage(
        () => `
          <img src="http://localhost/serious"
            data-src-hover="http://localhost/hover"
            data-src-look-0="http://localhost/north"
            data-src-look-45="http://localhost/northEast"
            data-src-look-90="http://localhost/east"
            data-src-look-135="http://localhost/southEast"
            data-src-look-180="http://localhost/south"
            data-src-look-225="http://localhost/southWest"
            data-src-look-270="http://localhost/west"
            data-src-look-315="http://localhost/northWest"
            data-timeToDefault="0"
          />
        `
      )

      withCreepyfaceRegistered(() => creepyface(img))

      describe('after a day with no points', () => {
        beforeAndAfter(() => {
          const getNewSrc = createGetNewSrc(img, provideMousePoint)
          expect(getNewSrc([0, -1])).toBe('http://localhost/north')
          jest.advanceTimersByTime(24 * 60 * 60)
        })

        it('keeps looking at the pointer', () =>
          expect(img.src).toBe('http://localhost/north'))
      })
    })

    describe('when there is only one image', () => {
      const img = withImage(
        () => `
          <img src="http://localhost/serious"
            data-src-look-0="http://localhost/north"
            data-fieldOfVision="180"
          />
        `
      )

      withCreepyfaceRegistered(() => creepyface(img))

      describe('and the pointer is within the field of vision', () => {
        beforeAndAfter(() => {
          createGetNewSrc(img, provideMousePoint)([0, -1])
        })

        it('looks at it', () => expect(img.src).toBe('http://localhost/north'))
      })

      describe('and the pointer is outside of the field of vision', () => {
        beforeAndAfter(() => {
          createGetNewSrc(img, provideMousePoint)([0, 1])
        })

        it('ignores it and looks forward', () =>
          expect(img.src).toBe('http://localhost/serious'))
      })
    })
  })
})
