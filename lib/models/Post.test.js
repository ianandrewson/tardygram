const mongoose = require('mongoose');
const Post = require('../models/Post.js');

describe('Post model tests', () => {
  it('should have a required userId', () => {
    const post = new Post();
    const { errors } = post.validateSync();
    expect(errors.userId.message).toEqual('Path `userId` is required.');
  });

  it('should have a required photoUrl', () => {
    const post = new Post();
    const { errors } = post.validateSync();
    expect(errors.photoUrl.message).toEqual('Path `photoUrl` is required.');
  });

  it('should have a required caption', () => {
    const post = new Post();
    const { errors } = post.validateSync();
    expect(errors.caption.message).toEqual('Path `caption` is required.');
  });

  it('should have a required tags field', () => {
    const post = new Post();
    const { errors } = post.validateSync();
    expect(errors.tags.message).toEqual('Path `tags` is required');
  });

  it('should have at least one tag', () => {
    const post = new Post({
      userId: new mongoose.Types.ObjectId(),
      photoUrl: 'test',
      caption: 'vacation photo',
      tags: []
    });
    const { errors } = post.validateSync();
    expect(errors.tags.message).toEqual('Path `tags` is less than the minimum required value (1).');
  });
  it('should be able to make a new Post', () => {
    const post = new Post({
      userId: new mongoose.Types.ObjectId(),
      photoUrl: 'test',
      caption: 'vacation photo',
      tags: ['#vacay']
    });
    expect(post.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
      photoUrl: post.photoUrl,
      caption: post.caption,
      tags: ['#vacay']
    });
  });
});
