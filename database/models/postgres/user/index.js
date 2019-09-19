'use strict'

const ErrorCodes = require('../../ErrorCodes')

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
        msg: ErrorCodes.EMAIL_ALREADY_EXISTS,
      },
      validate: {
        isEmail: {
          msg: ErrorCodes.INVALID_EMAIL,
        },
        notEmpty: {
          msg: ErrorCodes.IS_REQUIRED,
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
          msg: ErrorCodes.IS_REQUIRED,
        },
      },
    },
    passwordChangeDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: ErrorCodes.INVALID_DATE,
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
          msg: ErrorCodes.INVALID_DATE,
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
