const { expect } = require('chai');
const request = require('supertest');
const { Genre, Reader, Book, Author } = require('../src/models');
const app = require('../src/app');

const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
    author: Author,
    genre: Genre,
  };
  return models[model];
};

exports.getAllRecords = async (route, statusCode, bodyLength, models) => {
  const response = await request(app).get(`/${route}`);

  expect(response.status).to.equal(statusCode);
  expect(response.body.length).to.equal(bodyLength);

  response.body.forEach((model) => {
    const expected = models.find((g) => g.id === model.id);

    expect(model.field).to.equal(expected.field);
  });
};
