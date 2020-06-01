const {
  getAllItems,
  createItems,
  updateItems,
  getItemById,
  deleteItemById,
} = require('../controllers/helpers');

const getGenres = (req, res) => getAllItems(res, 'genre');

const createGenre = (req, res) => createItems(res, 'genre', req.body);

const getGenreById = (req, res) => getItemById(res, 'genre', req.params.id);

const updateGenreById = (req, res) => updateItems(res, 'genre', req.body, req.params.id);

const deleteGenreById = (req, res) => deleteItemById(res, 'genre', req.params.id);

module.exports = {
  getGenres,
  createGenre,
  getGenreById,
  updateGenreById,
  deleteGenreById,
};
