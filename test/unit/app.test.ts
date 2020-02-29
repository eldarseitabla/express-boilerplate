import { expect } from 'chai';
import { agent as request } from 'supertest';
import app from '../../src/app';

describe('GET /random-url', () => {
  it('should return 404', async() => {
    const res = await request(app).get('/reset').send({statusCode: 404, message: 'Not found'});
    expect(res.status).to.equal(404);
    expect(res.body).not.to.be.empty;
    expect(res.body.data).not.to.be.empty;
    expect(res.body.data).to.be.an('object');
    expect(res.body.error).to.be.empty;
  });
});
