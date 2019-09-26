'use strict'

const assert = require('assert')

/**
 * To Catch error "UnhandledPromiseRejectionWarning" when we forget correct write test with promises call
 */
process.on('unhandledRejection', (error) => {
  describe('Unhandled Rejection', () => {
    it('Promise Handler', () => {
      if (error) {
        assert.ok(false, `Unhandled Rejection: ${error.stack ? error.stack : error }`)
      } else {
        assert.ok(false, 'Unhandled Rejection something wrong')
      }
    })
  })
})
