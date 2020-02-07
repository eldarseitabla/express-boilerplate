'use strict'

module.exports = (sequelize, DataTypes) => sequelize.define('Role', {
  // eslint-disable-next-line strict
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})
