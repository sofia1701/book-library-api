/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'A Song of Ice and Fire',
          author: 'George R. R. Martin',
          genre: 'Fantasy',
          ISBN: '0-00-224584-1',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('A Song of Ice and Fire');
        expect(newBookRecord.title).to.equal('A Song of Ice and Fire');
        expect(newBookRecord.author).to.equal('George R. R. Martin');
        expect(newBookRecord.genre).to.equal('Fantasy');
        expect(newBookRecord.ISBN).to.equal('0-00-224584-1');
      });
      it('returns error if model fields are null', async () => {
        const response = await request(app).post('/books').send({
          title: 'A Song of Ice and Fire',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(newBookRecord).to.equal(null);
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
          author: 'J.G. Ballard',
        }),
        Book.create({
          title: 'The Catcher In The Rye',
          author: 'J.D. Salinger',
        }),
        Book.create({
          title: 'Brave New World',
          author: 'Aldous Huxley',
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((b) => b.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
        });
      });
    });
    describe('GET /books/:id,:title', () => {
      it('gets books records by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
      });
      it('returns a 404 if book is not found', async () => {
        const response = await request(app).get('/books/700A');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found');
      });
    });
    describe('PATCH /books/:id', () => {
      it('updates book records by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: 'New Author' });
        const updatedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedBook.author).to.equal('New Author');
      });
      it('returns a 404 if book is not found', async () => {
        const response = await request(app)
          .patch('/books/7000')
          .send({ author: 'New Author' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found');
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
        const response = await request(app).delete('/books/7000');

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('The book could not be found');
      });
    });
  });
});
