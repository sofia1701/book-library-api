const { Reader, Book } = require('../models');

const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
  };
  return models[model];
};

const getAllItems = (res, model) => {
  const Model = getModel(model);

  Model.findAll({ attributes: { exclude: ['password'] } }).then((allItems) => {
    res.status(200).json(allItems);
  });
};

const createItems = (res, model, item) => {
  const Model = getModel(model);

  Model.create(item)
    .then((itemCreated) => res.status(201).json(itemCreated))
    .catch((error) => {
      const errorMessages = error.errors.map((err) => err.message);
      res.status(400).json({ errors: errorMessages });
    });
};

const updateItems = (res, model, item, id) => {
  const Model = getModel(model);

  Model.update(item, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json({ error: 'The item could not be found.' });
    } else {
      Model.findByPk(id, { attributes: { exclude: ['password'] } }).then((updatedItem) => {
        res.status(200).json(updatedItem);
      });
    }
  });
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id, { attributes: { exclude: ['password'] } }).then((item) => {
    if (!item) {
      res.status(404).json({ error: 'The item could not be found.' });
    } else {
      res.status(200).json(item);
    }
  });
};

const deleteItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json({ error: 'The item could not be found.' });
    } else {
      Model.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  getAllItems,
  createItems,
  updateItems,
  getItemById,
  deleteItemById,
};
