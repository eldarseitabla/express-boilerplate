import { expect } from 'chai';
import { agent as request } from 'supertest';
import app from '../../src/app';

describe('GET /api', () => {
  it('should return 200 OK', async() => {
    const res = await request(app).get('/api').send({todo: 'first todo'});
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body.data).not.to.be.empty;
    expect(res.body.data).to.be.an('object');
    expect(res.body.error).to.be.empty;
  });
});
