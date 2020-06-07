import request, { Response } from 'supertest';
import assert from 'assert';
import { createSandbox } from 'sinon';
import { app } from '../../app';
import { UserDocument, UserMongo as User, RefreshTokenMongo as RefreshToken } from '../../models';
import { config } from '../../config';

const sandbox = createSandbox();

describe('auth.controller (acceptance)', () => {

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

  afterEach('after each', () => {
    sandbox.verifyAndRestore();
  });

  it('User can successful login', async () => {
    const user: UserDocument = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);
    assert.ok(typeof result.accessToken === 'string');
    assert.ok(typeof result.refreshToken === 'string');

    const { body: refreshTokenRes }: Response = await request(app)
      .post('/auth/refresh-tokens')
      .send({
        refreshToken: result.refreshToken,
      })
      .expect('Content-Type', /json/)
      .expect(200);
    assert.ok(typeof refreshTokenRes.accessToken === 'string');
    assert.ok(typeof refreshTokenRes.refreshToken === 'string');
  });

  it('User gets 403 on invalid credentials', async () => {
    await request(app)
      .post('/auth/sign-in')
      .send({
        email: 'INVALID@email.com',
        password: 'INVALID',
      })
      .expect(403);
  });

  it('User receives 401 on expired token', async () => {
    // const expiredToken: string = issueToken({ id: 1 }, { expiresIn: '1ms' });
    sandbox.stub(config.accessToken, 'expiresIn').value('1ms');

    const user: UserDocument = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expiredToken: string = result.accessToken;

    await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  it('User can get new access token using refresh token', async () => {
    const user: UserDocument = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const { body: res }: Response = await request(app)
      .post('/auth/refresh-tokens')
      .send({
        refreshToken: result.refreshToken,
      }).expect(200);
    assert.ok(typeof res.accessToken === 'string');
    assert.ok(typeof res.refreshToken === 'string');
  });

  it('User get 404 on invalid refresh token', async () => {
    await request(app)
      .post('/auth/refresh-tokens')
      .send({
        refreshToken: 'INVALID_REFRESH_TOKEN',
      }).expect(404);
  });

  it('User can use refresh token only once', async () => {
    const user: UserDocument = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const { body: firstResponse }: Response = await request(app)
      .post('/auth/refresh-tokens')
      .send({
        refreshToken: result.refreshToken,
      }).expect(200);
    assert.ok(typeof firstResponse.accessToken === 'string');
    assert.ok(typeof firstResponse.refreshToken === 'string');

    await request(app)
      .post('/auth/refresh-tokens')
      .send({
        refreshToken: result.refreshToken,
      }).expect(404);
  });

  it('Refresh tokens become invalid on logout', async () => {
    const user: UserDocument = new User(userData);
    await user.save();
    const { body: result }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .get('/auth/sign-out')
      .set('Authorization', `Bearer ${result.accessToken}`)
      .expect(200);

    await request(app).post('/auth/refresh-tokens').send({
      refreshToken: result.refreshToken,
    }).expect(404);
  });

  it('Multiple refresh tokens are valid', async () => {
    const user: UserDocument = new User(userData);
    await user.save();
    const { body: firstLoginResponse }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    const { body: secondLoginResponse }: Response = await request(app)
      .post('/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);


    // const { body: firstRefreshResponse }: Response = await request(app)
    //   .post('/auth/refresh-tokens')
    //   .send({
    //     refreshToken: firstLoginResponse.refreshToken,
    //   })
    //   .expect(201);
    // assert.ok(typeof firstRefreshResponse.accessToken === 'string');
    // assert.ok(typeof firstRefreshResponse.refreshToken === 'string');
    //
    // const { body: secondRefreshResponse }: Response = await request(app)
    //   .post('/auth/refresh-tokens')
    //   .send({
    //     refreshToken: secondLoginResponse.refreshToken,
    //   }).expect(202);
    // assert.ok(typeof secondRefreshResponse.accessToken === 'string');
    // assert.ok(typeof secondRefreshResponse.refreshToken === 'string');
  });
});
