const User = require('../models/User.js');
const mongoose = require('mongoose');

describe('User model tests', () => {
  it('has a required username', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.username.message).toEqual('Path `username` is required.');
  });

  it('has a required passwordHash', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });

  it('can create a new User', () => {
    const user = new User({
      username: 'HappyTree',
      password: 'password',
      profilePhotoUrl: 'https://www.blah.blah'
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      username: 'HappyTree',
      profilePhotoUrl: 'https://www.blah.blah'
    });
  });

  it('should be able to hash a password', () => {
    const user = new User({
      username: 'test',
      password: 'password'
    });
    expect(user.passwordHash).toEqual(expect.any(String));
  });
});
