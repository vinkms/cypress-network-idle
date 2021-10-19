/// <reference path="../../src/index.d.ts" />

import('../..')

it('waits for the network call', () => {
  cy.visit('/')

  cy.waitForNetworkIdle(2000)
    .should('have.keys', 'started', 'finished', 'waited', 'callCount')
    .then(({ waited, callCount }) => {
      // the page makes the Ajax call after 1000 ms
      // thus total resolve time should be >= 3000 ms
      // but probably under 4 seconds
      expect(waited, 'waited ms').to.be.within(3000, 4000)
      expect(callCount, 'callCount').to.equal(1)
    })
})

it('uses the response timestamp', () => {
  cy.visit('/delayed')

  cy.waitForNetworkIdle('GET', '/user/delayed', 3000)
    .should('have.keys', 'started', 'finished', 'waited', 'callCount')
    .then(({ waited, callCount }) => {
      // the page makes an Ajax call after 1500 ms
      // which is delayed by 1000 ms on the server
      // thus total resolve time should be:
      // 1000 + 1000 + 3000
      // but probably under 7 seconds
      expect(waited, 'waited ms').to.be.within(5000, 7000)
      expect(callCount, 'callCount').to.equal(1)
    })
})
