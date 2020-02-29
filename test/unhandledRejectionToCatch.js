import { expect } from 'chai';

/**
 * To Catch error "UnhandledPromiseRejectionWarning" when we forget correct write test with promises call
 */
process.on('unhandledRejection', (error) => {
  describe('Unhandled Rejection', () => {
    it('Promise Handler', () => {
      if (error) {
        expect(false, `Unhandled Rejection: ${error.stack ? error.stack : error }`).ok;
      } else {
        expect(false, 'Unhandled Rejection something wrong').ok;
      }
    });
  });
});
