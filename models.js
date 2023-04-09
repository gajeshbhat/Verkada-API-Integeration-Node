// Import Sequelize and Initialize Database
const { Sequelize, Model, DataTypes } = require('sequelize');
const db = new Sequelize('sqlite:./jdsports.db');

// Initialize Models
class Store extends Model {}
class Camera extends Model {}
class PointOfService extends Model {}
class Transaction extends Model {}
class TransactionItem extends Model {}
class CameraEventUID extends Model {}

// Initialize Models Function called in the app.js file
function initializeModels() {
    Store.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      zip: DataTypes.STRING,
    }, { sequelize: db, modelName: 'Store' });
  
    Camera.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      camera_id: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
    }, { sequelize: db, modelName: 'Camera' });
  
    PointOfService.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      pos_id: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
    }, { sequelize: db, modelName: 'PointOfService' });
  
    Transaction.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      transaction_id: DataTypes.STRING,
      pos_id: DataTypes.INTEGER,
      timestamp: DataTypes.DATE,
    }, { sequelize: db, modelName: 'Transaction' });
  
    TransactionItem.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      transaction_id: DataTypes.INTEGER,
      item_id: DataTypes.STRING,
    }, { sequelize: db, modelName:
    'TransactionItem' });
  
    CameraEventUID.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      camera_id: DataTypes.INTEGER,
      event_uid: DataTypes.STRING,
    }, { sequelize: db, modelName: 'CameraEventUID' });
  
    Store.hasMany(Camera);
    Store.hasMany(PointOfService);
    PointOfService.hasMany(Transaction);
    Transaction.hasMany(TransactionItem);
    Camera.hasMany(CameraEventUID);
  }

  module.exports = {
    initializeModels,
  };