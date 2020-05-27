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

const getBookById = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then((book) => {
    if (!book) {
      return res.status(404).json({ error: 'The book could not be found' });
    }
    return res.status(200).json(book);
  });
};

const updateBookById = (req, res) => {
  const { id } = req.params;
  Book.update(req.body, { where: { id } })
    .then(([updatedBook]) => {
      if (!updatedBook) {
        return res.status(404).json({ error: 'The book could not be found' });
      }
      return res.status(200).json(updatedBook);
    });
};

module.exports = {
  getBooks,
  createBook,
  getBookById,
  updateBookById,
};
