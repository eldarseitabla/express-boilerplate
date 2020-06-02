import request, { Response } from 'supertest';
import assert from 'assert';
import { app } from '../../app';
import { issueToken } from '../helpers/issue-token';
import { UserDocument, UserMongo as User, RefreshTokenMongo as RefreshToken } from '../../models';

describe('auth.controller (acceptance)', () => {
  let user: UserDocument;

  const userData: { email: string; password: string } = {
    email: 'test@email.com',
    password: 'password123',
  } as UserDocument;

  before('before all', async () => {
    /*
     * TODO If we don't have mongo connection we have error:
     * Error: Timeout of 20000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
     * (/Users/eldarseytablaev/GitHub/eldarseytablaev/express-boilerplate/dist/tests/acceptance/auth.controller.acceptance.js)
     */
    await app.get('init')();
  });

  beforeEach('before each', async () => {
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
  });

  it('User can succesfully login', async () => {
    user = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);
    assert.ok(typeof result.token === 'string');
    assert.ok(typeof result.refreshToken === 'string');

    const refreshTokenRes: Response = await request(app)
      .post('/auth/refresh-token')
      .set('Authorization', 'Bearer ' + result.token)
      .send({
        refreshToken: result.refreshToken,
      })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '322')
      .expect(200);
    assert.ok(typeof refreshTokenRes.body.token === 'string');
    assert.ok(typeof refreshTokenRes.body.refreshToken === 'string');
  });

  // TODO User gets 403 on invalid credentials
  it.skip('User gets 403 on invalid credentials', async () => {
    await request(app)
      .post('/auth/login')
      .send({
        login: 'INVALID',
        password: 'INVALID',
      })
      .expect(403);
  });

  // TODO User receives 401 on expired token
  it.skip('User receives 401 on expired token', async () => {
    const expiredToken: string = issueToken({ id: 1 }, { expiresIn: '1ms' });
    await app
      .get('/users')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  // TODO User can get new access token using refresh token
  it.skip('User can get new access token using refresh token', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: 'REFRESH_TOKEN_1',
      }).expect(200);
    assert.ok(typeof res.body.token === 'string');
    assert.ok(typeof res.body.refreshToken === 'string');
  });

  // TODO User get 404 on invalid refresh token
  it.skip('User get 404 on invalid refresh token', async () => {
    await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: 'INVALID_REFRESH_TOKEN',
      }).expect(404);
  });

  // TODO User can use refresh token only once
  it.skip('User can use refresh token only once', async () => {
    const firstResponse: Response = await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: 'REFRESH_TOKEN_ONCE',
      }).expect(200);
    assert.ok(typeof firstResponse.body.token === 'string');
    assert.ok(typeof firstResponse.body.refreshToken === 'string');

    await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: 'REFRESH_TOKEN_ONCE',
      }).expect(404);
  });

  // TODO Refresh tokens become invalid on logout
  it.skip('Refresh tokens become invalid on logout', async () => {
    await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${issueToken({ id: 2 })}`)
      .expect(200);

    await request(app).post('/auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT',
    }).expect(404);
  });

  // TODO Multiple refresh tokens are valid
  it.skip('Multiple refresh tokens are valid', async () => {
    const firstLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        login: 'user2',
        password: 'user2',
      })
      .expect(200);
    const secondLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        login: 'user2',
        password: 'user2',
      })
      .expect(200);


    const firstRefreshResponse = await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: firstLoginResponse.body.refreshToken,
      })
      .expect(200);
    assert.ok(typeof firstRefreshResponse.body.token === 'string');
    assert.ok(typeof firstRefreshResponse.body.refreshToken === 'string');

    const secondRefreshResponse = await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: secondLoginResponse.body.refreshToken,
      }).expect(200);
    assert.ok(typeof secondRefreshResponse.body.token === 'string');
    assert.ok(typeof secondRefreshResponse.body.refreshToken === 'string');
  });
});
