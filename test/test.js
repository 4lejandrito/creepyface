// @flow
/* global it, describe, afterAll, beforeAll, expect */
const { By, Builder } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const url = path => `file://${__dirname}/${path}`

describe('Creepyface', () => {
  ['index.html', 'index-js.html'].forEach(fileName => {
    describe(fileName, () => {
      let browser

      beforeAll(() => {
        browser = new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(
            new firefox.Options().headless()
          ).build()
        return browser.get(url(fileName))
      })
      afterAll(() => browser.quit())

      it('shows the default src by default', async () => (
        expect(
          browser.findElement(By.css('img')).getAttribute('src')
        ).resolves.toBe(url('img/serious.jpg'))
      ))

      describe('when the mouse moves around creepyface', () => {
        const testLook = (getCoords, name) => async () => {
          const creepyface = await browser.findElement(By.css('img'))
          const size = await creepyface.getRect()
          await browser.actions().move({ duration: 10, origin: creepyface, ...getCoords(size) }).pause(100).perform()
          return expect(creepyface.getAttribute('src')).resolves.toBe(url(`img/${name}`))
        }

        it('goes crazy', testLook(
          size => ({
            x: 0,
            y: 0
          }),
          `crazy.jpg`
        ))

        it('follows it north', testLook(
          ({ width, height }) => ({
            x: 0,
            y: -(Math.floor(height / 2) + 1)
          }),
          `n.jpg`
        ))

        it('follows it north-east', testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: -(Math.floor(height / 2) + 1)
          }),
          `ne.jpg`
        ))

        it('follows it east', testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: 0
          }),
          `e.jpg`
        ))

        it('follows it south-east', testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: Math.floor(height / 2) + 1
          }),
          `se.jpg`
        ))

        it('follows it south', testLook(
          ({ width, height }) => ({
            x: 0,
            y: Math.floor(height / 2) + 1
          }),
          `s.jpg`
        ))

        it('follows it south-west', testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: Math.floor(height / 2) + 1
          }),
          `sw.jpg`
        ))

        it('follows it west', testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: 0
          }),
          `w.jpg`
        ))

        it('follows it north-west', testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: -(Math.floor(height / 2) + 1) }),
          `nw.jpg`
        ))

        it('goes back to the default src after 1 second', async () => {
          await browser.actions().pause(1000).perform()
          return expect(
            browser.findElement(By.css('img')).getAttribute('src')
          ).resolves.toBe(url('img/serious.jpg'))
        })
      })
    })
  })
})
