const { Reader, Book, Author, Genre } = require('../models');

const get404error = (model) => ({ error: `The ${model} could not be found.` });

const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
    author: Author,
    genre: Genre,
  };
  return models[model];
};

const modelOptions = (model) => {
  if (model === 'book') return { include: [{ model: Author }, { model: Genre }] };
  if (model === 'author' || model === 'genre') return { include: Book };
  return {};
};

const getAllItems = (res, model) => {
  const Model = getModel(model);

  Model.findAll({
    ...modelOptions(model),
    attributes: { exclude: ['password'] },
  }).then((allItems) => {
    res.status(200).json(allItems);
  });
};

const createItems = (res, model, item) => {
  const Model = getModel(model);

  Model.create(item)
    .then((itemCreated) => {
      const hidePassword = itemCreated;
      delete hidePassword.dataValues.password;
      res.status(201).json(itemCreated);
    })
    .catch((error) => {
      const errorMessages = error.errors.map((err) => err.message);
      res.status(400).json({ errors: errorMessages });
    });
};

const updateItems = (res, model, item, id) => {
  const Model = getModel(model);

  Model.update(item, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json(get404error(model));
    } else {
      Model.findByPk(id, { attributes: { exclude: ['password'] } }).then(
        (updatedItem) => {
          res.status(200).json(updatedItem);
        }
      );
    }
  });
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id, {
    ...modelOptions(model),
    attributes: { exclude: ['password'] },
  }).then((item) => {
    if (!item) {
      res.status(404).json(get404error(model));
    } else {
      res.status(200).json(item);
    }
  });
};

const deleteItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json(get404error(model));
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
