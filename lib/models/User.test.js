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
    expect(user).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      username: 'HappyTree',
      passwordHash: expect.any(String),
      profilePhotoUrl: 'https://www.blah.blah'
    });
  });
});
