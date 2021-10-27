/// <reference types="cypress" />

;['index.html', 'index-js.html'].forEach((fileName) => {
  describe(`${fileName}`, () => {
    beforeEach(() => {
      cy.visit(`./test/${fileName}`)
    })

    it('shows the default src by default', () => {
      cy.get('img').should('have.attr', 'src', 'img/serious.jpg')
    })

    describe('when the mouse moves around creepyface', () => {
      const testLook =
        (
          getCoords: (rect: DOMRect) => { x: number; y: number },
          name: string
        ) =>
        () => {
          cy.get('img').then(($el) => {
            const size = $el[0].getBoundingClientRect()
            const coords = getCoords(size)
            cy.get('img').trigger('mousemove', {
              clientX: size.x + size.width / 2 + coords.x,
              clientY: size.y + size.height / 2 + coords.y,
            })
            cy.wait(100)
            cy.get('img').should('have.attr', 'src', `img/${name}`)
          })
        }

      it(
        'goes crazy',
        testLook(
          () => ({
            x: 0,
            y: 0,
          }),
          `crazy.jpg`
        )
      )

      it(
        'follows it north',
        testLook(
          ({ height }) => ({
            x: 0,
            y: -(Math.floor(height / 2) + 100),
          }),
          `n.jpg`
        )
      )

      it(
        'follows it north-east',
        testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 1,
            y: -(Math.floor(height / 2) + 1),
          }),
          `ne.jpg`
        )
      )

      it(
        'follows it east',
        testLook(
          ({ width }) => ({
            x: Math.floor(width / 2) + 10,
            y: 0,
          }),
          `e.jpg`
        )
      )

      it(
        'follows it south-east',
        testLook(
          ({ width, height }) => ({
            x: Math.floor(width / 2) + 10,
            y: Math.floor(height / 2) + 10,
          }),
          `se.jpg`
        )
      )

      it(
        'follows it south',
        testLook(
          ({ height }) => ({
            x: 0,
            y: Math.floor(height / 2) + 2,
          }),
          `s.jpg`
        )
      )

      it(
        'follows it south-west',
        testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: Math.floor(height / 2) + 1,
          }),
          `sw.jpg`
        )
      )

      it(
        'follows it west',
        testLook(
          ({ width }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: 0,
          }),
          `w.jpg`
        )
      )

      it(
        'follows it north-west',
        testLook(
          ({ width, height }) => ({
            x: -(Math.floor(width / 2) + 1),
            y: -(Math.floor(height / 2) + 1),
          }),
          `nw.jpg`
        )
      )

      it('goes back to the default src after 1 second', () => {
        cy.wait(1000)
        cy.get('img').should('have.attr', 'src', 'img/serious.jpg')
      })
    })
  })
})
