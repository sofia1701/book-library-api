const {
  getAllItems,
  createItems,
  updateItems,
  getItemById,
  deleteItemById,
} = require('../controllers/helpers');

const getAuthors = (req, res) => getAllItems(res, 'author');

const createAuthor = (req, res) => createItems(res, 'author', req.body);

const getAuthorById = (req, res) => getItemById(res, 'author', req.params.id);

const updateAuthorById = (req, res) => updateItems(res, 'author', req.body, req.params.id);

const deleteAuthorById = (req, res) => deleteItemById(res, 'author', req.params.id);

module.exports = {
  getAuthors,
  createAuthor,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
