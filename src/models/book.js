module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Title cannot be empty',
        },
      },
    },
    ISBN: {
      type: DataTypes.STRING,
      unique: {
        args: [true],
        msg: 'ISBN must be unique',
      },
    },
  };

  return sequelize.define('Book', schema);
};
