import { ok } from 'assert';

/**
 * To Catch error "UnhandledPromiseRejectionWarning" when we forget correct write test with promises call
 */
process.on('unhandledRejection', (error: Error) => {
  describe('Unhandled Rejection', () => {
    it('Promise Handler', () => {
      if (error) {
        ok(false, `Unhandled Rejection: ${error.stack ? error.stack : error}`);
      } else {
        ok(false, 'Unhandled Rejection something wrong');
      }
    });
  });
});
