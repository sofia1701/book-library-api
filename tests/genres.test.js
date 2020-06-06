const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');
const helpers = require('./helpers.test');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Thriller',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Thriller');
        expect(newGenreRecord.genre).to.equal('Thriller');
      });
      it('returns an error if model field is null', async () => {
        const response = await request(app).post('/genres').send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });
      it('returns an error if field is not unique', async () => {
        const response1 = await request(app).post('/genres').send({
          genre: 'Horror fiction',
        });
        const response2 = await request(app).post('/genres').send({
          genre: 'Horror fiction',
        });
        const newGenreRecord1 = await Genre.findByPk(response1.body.id, {
          raw: true,
        });
        const newGenreRecord2 = await Genre.findByPk(response2.body.id, {
          raw: true,
        });

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);

        expect(response1.body.errors).to.equal(undefined);
        expect(response2.body.errors.length).to.equal(1);

        expect(newGenreRecord1.genre).to.equal('Horror fiction');
        expect(newGenreRecord2).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({ genre: 'Mystery' }),
        Genre.create({ genre: 'Narrative' }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genres records', async () => {
        await helpers.getAllRecords('genres', 200, 2, genres);
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });
      it('returns an error if genre does not exist', async () => {
        const response = await request(app).get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Fiction' });

        const updatedGenre = await Genre.findByPk(genre.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(updatedGenre.genre).to.equal('Fiction');
      });
      it('returns a 404 if genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'Fiction' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .delete(`/genres/${genre.id}`);

        const deletedGenre = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });
      it('returns a 404 if genre does not exist', async () => {
        const response = await request(app)
          .delete('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
