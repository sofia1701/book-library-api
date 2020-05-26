const { Book } = require('../models');

const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
};

const createBook = (req, res) => {
  Book.create(req.body)
    .then((newBookCreated) => res.status(201).json(newBookCreated))
    .catch((error) => {
      const errorMessages = error.errors.map((err) => err.message);
      res.status(400).json({ error: errorMessages });
    });
};


module.exports = {
  getBooks,
  createBook,
};
