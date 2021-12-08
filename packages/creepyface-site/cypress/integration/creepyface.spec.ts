/// <reference types="cypress" />
import path from 'path'

function mainCreepyface() {
  return cy.get('img[alt="The main Creepyface"')
}

describe(`creepyface.io`, () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the title', () => {
    cy.contains('Creepyface')
  })

  it('shows the main creepyface', () => {
    mainCreepyface().should('have.attr', 'src', '/img/0/serious')
  })

  it('shows the mosaic with all the creepyfaces', () => {
    cy.get('img[alt="A stranger\'s Creepyface"').should('have.length', 30)
  })

  it('shows the code', () => {
    cy.contains('Show code').click()
    cy.contains(`<script src="${Cypress.config().baseUrl}/creepyface.js">`)
    cy.contains('Hide code').click()
  })

  it('serves the images of each creepyface', () => {
    cy.request('/img/0/serious').then((response) => {
      expect(response.status).to.eq(200)
      expect(
        parseInt(response.headers['content-length'] as string)
      ).to.be.greaterThan(0)
      expect(response.headers['content-type']).to.eq('image/jpeg')
    })
  })

  describe('when the mouse moves around the main creepyface', () => {
    const testLook =
      (getCoords: (rect: DOMRect) => { x: number; y: number }, name: string) =>
      () => {
        mainCreepyface().then(($el) => {
          const size = $el[0].getBoundingClientRect()
          const coords = getCoords(size)
          mainCreepyface().trigger('mousemove', {
            clientX: size.x + size.width / 2 + coords.x,
            clientY: size.y + size.height / 2 + coords.y,
          })
          cy.wait(100)
          mainCreepyface().should('have.attr', 'src', `/img/0/${name}`)
        })
      }

    it(
      'goes crazy',
      testLook(
        () => ({
          x: 0,
          y: 0,
        }),
        `hover`
      )
    )

    it(
      'follows it north',
      testLook(
        ({ height }) => ({
          x: 0,
          y: -(Math.floor(height / 2) + 100),
        }),
        `0`
      )
    )

    it(
      'follows it north-east',
      testLook(
        ({ width, height }) => ({
          x: Math.floor(width / 2) + 1,
          y: -(Math.floor(height / 2) + 1),
        }),
        `45`
      )
    )

    it(
      'follows it east',
      testLook(
        ({ width }) => ({
          x: Math.floor(width / 2) + 10,
          y: 0,
        }),
        `90`
      )
    )

    it(
      'follows it south-east',
      testLook(
        ({ width, height }) => ({
          x: Math.floor(width / 2) + 10,
          y: Math.floor(height / 2) + 10,
        }),
        `135`
      )
    )

    it(
      'follows it south',
      testLook(
        ({ height }) => ({
          x: 0,
          y: Math.floor(height / 2) + 2,
        }),
        `180`
      )
    )

    it(
      'follows it south-west',
      testLook(
        ({ width, height }) => ({
          x: -(Math.floor(width / 2) + 1),
          y: Math.floor(height / 2) + 1,
        }),
        '225'
      )
    )

    it(
      'follows it west',
      testLook(
        ({ width }) => ({
          x: -(Math.floor(width / 2) + 1),
          y: 0,
        }),
        '270'
      )
    )

    it(
      'follows it north-west',
      testLook(
        ({ width, height }) => ({
          x: -(Math.floor(width / 2) + 1),
          y: -(Math.floor(height / 2) + 1),
        }),
        '315'
      )
    )

    it('goes back to the default src after 1 second', () => {
      cy.wait(1000)
      mainCreepyface().should('have.attr', 'src', '/img/0/serious')
    })
  })

  it('can be used to create and download a creepyface', () => {
    cy.contains('Create yours').click()
    for (let i = 0; i < 10; i++) {
      cy.contains('Take picture').click()
    }
    cy.contains('Download and publish').click()
    cy.readFile(
      path.join(Cypress.config('downloadsFolder'), 'creepyface.zip')
    ).should((buffer) => expect(buffer.length).to.be.gt(50000))
    cy.contains('Download again')
    cy.visit('/admin', {
      auth: {
        username: 'creepyface',
        password: '',
      },
    })
    cy.contains('New!')
  })
})
