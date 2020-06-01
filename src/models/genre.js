module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Genre cannot be empty',
        },
        notEmpty: {
          args: [true],
          msg: 'Genre cannot be empty',
        },
      },
      unique: {
        args: [true],
        msg: 'Genre must be unique',
      },
    },
  };

  return sequelize.define('Genre', schema);
};
