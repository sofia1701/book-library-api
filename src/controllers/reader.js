const {
  getAllItems,
  createItems,
  updateItems,
  getItemById,
  deleteItemById,
} = require('../controllers/helpers');

const getReaders = (_, res) => getAllItems(res, 'reader');

const createReader = (req, res) => createItems(res, 'reader', req.body);

const updateReader = (req, res) => updateItems(res, 'reader', req.body, req.params.id);

const getReaderById = (req, res) => getItemById(res, 'reader', req.params.id);

const deleteReader = (req, res) => deleteItemById(res, 'reader', req.params.id);

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader,
};
