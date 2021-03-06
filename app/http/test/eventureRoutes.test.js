const chai = require('chai');
const chaiHttp = require('chai-http');
const {container, truncateAll, initMockApp} = require('./mockApp');
const server = require('../../http')(container);
const uuid = require('uuid/v4')
const {assert} = chai;

chai.use(chaiHttp);


describe("Eventure Routes", () => {
  let organization, user, accessToken;

  before(async () => {
    mockApp = await initMockApp()
    organization = mockApp.organization
    user = mockApp.user
    accessToken = mockApp.accessToken
  })

  after(async () => {
    await truncateAll()
  })

  describe("Creating Eventure", () => {
    let testEventure

    it("creates an eventure", done => {
      const evData = {
        id: uuid(),
        name: 'testEventure',
        startDate: new Date(),
        endDate: new Date(),
      }

      chai.request(server)
        .post('/api/v1/eventure')
        .send(evData)
        .set('Organization', organization.id)
        .set('Authorization', `Bearer ${accessToken.token}`)
        .then(res => {
          assert.propertyVal(res, 'status', 200)
          assert.isObject(res.body)
          assert.equal(res.body.organizationId, organization.id)
          testEventure = res.body
          done()
        })
        .catch(done)
      })
      
    it("Creates a listing on the testEventure", done => {
      const listData = {
        eventureId: testEventure.id,
        name: 'testListing',
        startDate: new Date(),
        endDate: new Date(),
        price: 0
      }
      chai.request(server)
      .post(`/api/v1/eventure/${testEventure.id}/listing`)
      .send(listData)
      .set('Organization', organization.id)
      .set('Authorization', `Bearer ${accessToken.token}`)
      .then(res => {
        assert.propertyVal(res, 'status', 200)
        assert.isObject(res.body)
        assert.isArray(res.body.listings)
        done()
      })
      .catch(res => {
        if (res.response && res.response.error) {
          done(res.response.error)
        } else {
          done(res)
        }
      })
    })

    it("Creates as listing with an initial fee schedule", async () => {
      const regDate = new Date()
      const listData = {
        eventureId: testEventure.id,
        name: 'testListing2',
        startDate: new Date(),
        endDate: new Date(),
        registrationOpenDate: regDate,
        price: 12
      }

      const res = await chai.request(server) 
        .post(`/api/v1/eventure/${testEventure.id}/listing`)
        .send(listData)
        .set('Organization', organization.id)
        .set('Authorization', `Bearer ${accessToken.token}`)

        assert.propertyVal(res, 'status', 200)
        assert.isObject(res.body)
        assert.isArray(res.body.listings)

        const listing = res.body.listings.find(l => l.name === listData.name)
        assert.isOk(listing)
        assert.equal(listing.feeSchedule.length, 1)

    })
      
  })

})