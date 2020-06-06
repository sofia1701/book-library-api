/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');
const helpers = require('./helpers.test');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'A Song of Ice and Fire',
          ISBN: '0-00-224584-1',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('A Song of Ice and Fire');
        expect(newBookRecord.title).to.equal('A Song of Ice and Fire');
        expect(newBookRecord.ISBN).to.equal('0-00-224584-1');
      });
      it('returns error if model fields are null', async () => {
        const response = await request(app).post('/books').send({});
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newBookRecord).to.equal(null);
      });
      it('returns an error if field is not unique', async () => {
        const response1 = await request(app).post('/books').send({
          title: 'Book',
          ISBN: '978-3-16-148410-0',
        });
        const response2 = await request(app).post('/books').send({
          title: 'Book',
          ISBN: '978-3-16-148410-0',
        });
        const newBookRecord1 = await Book.findByPk(response1.body.id, {
          raw: true,
        });
        const newBookRecord2 = await Book.findByPk(response2.body.id, {
          raw: true,
        });

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);

        expect(response1.body.errors).to.equal(undefined);
        expect(response2.body.errors.length).to.equal(1);

        expect(newBookRecord1.ISBN).to.equal('978-3-16-148410-0');
        expect(newBookRecord2).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'The Highrise',
        }),
        Book.create({
          title: 'The Catcher In The Rye',
        }),
        Book.create({
          title: 'Brave New World',
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all book records', async () => {
        await helpers.getAllRecords('books', 200, 3, books);
      });
    });
    describe('GET /books/:id', () => {
      it('gets books records by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
      });
      it('returns a 404 if book is not found', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
    describe('PATCH /books/:id', () => {
      it('updates book records by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: 'New Title' });
        const updatedBook = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBook.title).to.equal('New Title');
      });
      it('returns a 404 if book is not found', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ title: 'New Title' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
    describe('DELETE /books/:id', () => {
      it('deletes a book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);

        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });
      it('returns a 404 if book is not found', async () => {
        const response = await request(app).delete('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
