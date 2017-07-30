const chai = require('chai');
const Registration = require('../registration');
const {assert} = chai;


describe('Registration', () => {
  describe('creating', () => {
    it('creates a registration', () => {
      const data = {
        clientId: 'a',
        eventureId: 'b',
        listingId: 'c',
        participantId: 'd',
      };

      const reg = Registration.create(data);
      assert.isOk(reg);
    })
  })
})
