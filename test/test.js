const { By, Builder } = require('selenium-webdriver')
const { LegacyActionSequence } = require('selenium-webdriver/lib/actions')
const firefox = require('selenium-webdriver/firefox')
const chrome = require('selenium-webdriver/chrome')
const url = path => `file://${__dirname}/${path}`

jest.setTimeout(10000)

const browsers = [
  {
    name: 'chrome',
    driver: () =>
      new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build()
  },
  {
    name: 'firefox',
    driver: () =>
      new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options().headless())
        .build()
  }
]

const describeCombination = fn => () => {
  ;['index.html', 'index-js.html'].forEach(fileName => {
    describe(fileName, () => {
      browsers.forEach(browser => {
        describe(`Running in ${browser.name}`, () => {
          let driver = browser.driver()
          beforeAll(() => driver.get(url(fileName)))
          afterAll(() => driver.quit())
          fn(driver, browser.name === 'firefox')
        })
      })
    })
  })
}

describe(
  'Creepyface',
  describeCombination((driver, supportsW3C) => {
    it('shows the default src by default', async () =>
      expect(
        driver.findElement(By.css('img')).getAttribute('src')
      ).resolves.toBe(url('img/serious.jpg')))

    describe('when the mouse moves around creepyface', () => {
      const testLook = (getCoords, name) => async () => {
        const creepyface = await driver.findElement(By.css('img'))
        const size = await creepyface.getRect()
        const coords = getCoords(size)
        if (!supportsW3C) {
          await new LegacyActionSequence(driver)
            .mouseMove(creepyface, {
              x: coords.x + size.width / 2,
              y: coords.y + size.height / 2
            })
            .perform()
        } else {
          await driver
            .actions()
            .move({ duration: 10, origin: creepyface, ...coords })
            .perform()
        }
        await driver.sleep(100)
        return expect(creepyface.getAttribute('src')).resolves.toBe(
          url(`img/${name}`)
        )
      }

      it(
        'goes crazy',
        testLook(
          size => ({
            x: 0,
            y: 0
          }),
          `crazy.jpg`
        )
      )

      it(
        'follows it north',
        testLook(
          ({ width, height }) => ({
            x: 0,
            y: -(Math.floor(height / 2) + 100)
          }),
          `n.jpg`
        )
      )

      it(
        'follows it north-east',
        testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: -(Math.floor(height / 2) + 1)
          }),
          `ne.jpg`
        )
      )

      it(
        'follows it east',
        testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 10,
            y: 0
          }),
          `e.jpg`
        )
      )

      it(
        'follows it south-east',
        testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: Math.floor(height / 2) + 1
          }),
          `se.jpg`
        )
      )

      it(
        'follows it south',
        testLook(
          ({ width, height }) => ({
            x: 0,
            y: Math.floor(height / 2) + 2
          }),
          `s.jpg`
        )
      )

      it(
        'follows it south-west',
        testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: Math.floor(height / 2) + 1
          }),
          `sw.jpg`
        )
      )

      it(
        'follows it west',
        testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: 0
          }),
          `w.jpg`
        )
      )

      it(
        'follows it north-west',
        testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: -(Math.floor(height / 2) + 1)
          }),
          `nw.jpg`
        )
      )

      it('goes back to the default src after 1 second', async () => {
        await driver.sleep(1000)
        return expect(
          driver.findElement(By.css('img')).getAttribute('src')
        ).resolves.toBe(url('img/serious.jpg'))
      })
    })
  })
)
