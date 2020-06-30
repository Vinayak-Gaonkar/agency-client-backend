/*
Routes
In
Test
*/
const request = require('supertest');
const app = require('../server');

describe('description', function() {
  it('should get genres', async () => {
    const res = await request(app)
      .get('/genres')
      .send()
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('post');
  });
});
