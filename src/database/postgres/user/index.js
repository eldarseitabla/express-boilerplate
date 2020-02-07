'use strict'

const errorCodes = require('../../../error-codes')

module.exports = (sequelize, DataTypes) => {
  const { models } = sequelize

  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: {
        msg: errorCodes.EMAIL_ALREADY_EXISTS,
      },
      validate: {
        isEmail: {
          msg: errorCodes.INVALID_EMAIL,
        },
        notEmpty: {
          msg: errorCodes.IS_REQUIRED,
        },
      },
    },
    emailConfirm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: errorCodes.IS_REQUIRED,
        },
      },
    },
    passwordChangeDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: errorCodes.INVALID_DATE,
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['firstName', 'lastName']),
      get() {
        return `${this.firstName} ${this.lastName}`
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: errorCodes.INVALID_DATE,
        },
        // isInAge(timestamp) {
        //     if (moment().diff(timestamp, 'years') < constraints.ALLOWED_AGE) {
        //         throw new Error(ErrorCodes.TOO_YOUNG)
        //     }
        // },
      },
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    facebookId: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    twitterId: {
      type: DataTypes.STRING,
    },
  })

  User.belongsTo(models.Role)
  User.belongsTo(models.Language)

  return User
}
