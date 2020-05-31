module.exports = (sequelize, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Author cannot be empty',
        },
        notEmpty: {
          args: [true],
          msg: 'Author cannot be empty',
        },
      },
      unique: {
        args: [true],
        msg: 'Author must be unique',
      },
    },
  };

  return sequelize.define('Author', schema);
};
