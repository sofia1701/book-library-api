const {
  getAllItems,
  createItems,
  updateItems,
  getItemById,
  deleteItemById,
} = require('../controllers/helpers');

const getBooks = (_, res) => getAllItems(res, 'book');

const createBook = (req, res) => createItems(res, 'book', req.body);

const getBookById = (req, res) => getItemById(res, 'book', req.params.id);

const updateBookById = (req, res) => updateItems(res, 'book', req.body, req.params.id);

const deleteBookById = (req, res) => deleteItemById(res, 'book', req.params.id);

module.exports = {
  getBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
