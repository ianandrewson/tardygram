require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');
const User = require('../lib/models/User.js');

describe('auth route tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able signup a new user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
          __v: 0
        });
      });
  });

  it('should be able to login a user', async() => {
    await User.create({ username: 'test', password: 'password' });
    return request.agent(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
          __v: 0
        });
      });
  });

  it('should throw an error if logging in with an incorrect email', async() => {
    User.create({ username: 'test', password: 'password' });
    return request.agent(app)
      .post('/api/v1/auth/login')
      .send({ username: 'wrongUsername', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username/password. Please try again.',
          status: 401
        });
      });
  });

  it('should throw an error if logging in with an incorrect password', async() => {
    await User.create({ username: 'test', password: 'password' });
    return request.agent(app)
      .post('/api/v1/auth/login')
      .send({ username: test, password: 'DefinitelyNotTheRightPassword' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username/email. Please try again',
          status: 401
        });
      });
  });

  it('should be able to verify a user is logged in', async() => {
    await User.create({ username: 'test', password: 'password' });
    return request.agent(app)
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
          __v: 0
        });
      });
  });

  it('should throw an error when a new user is made with an existing username', async() => {
    await User.create({ username: 'test', password: 'password' });
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/signup')
      .send({ username: 'test', password: 'test' })
      .then(res => {
        expect(res.body).toEqual('Path `username` is not unique.');
      });
  });
});
