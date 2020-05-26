module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: [true],
          msg: 'Please enter a valid email address',
        },
        notNull: {
          args: [true],
          msg: 'Email cannot be empty',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Name cannot be empty',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Password cannot be empty',
        },
        len: {
          args: [8],
          msg: "Password needs to be longer than 8 characters"
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
