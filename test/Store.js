const assert = require('assert');
const { Sequelize, Model, DataTypes } = require('sequelize');
const { initializeModels } = require('../models');

// Initialize Database Connection
const db = new Sequelize('sqlite::memory:', { logging: false });

// Initialize Models
class Store extends Model {}
initializeModels(db);
Store.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  zip: DataTypes.STRING,
}, { sequelize: db, modelName: 'Store' });

// Test Suite
describe('Store model', () => {
  let store;

  beforeEach(async () => {
    // Sync database before each test case
    await db.sync({ force: true });

    // Create a new store before each test case
    store = await Store.create({
      name: 'JD Sports London',
      address: 'Oxford Street',
      city: 'London',
      state: 'London',
      country: 'UK',
      zip: '12345',
    });
  });

  it('should create a new store with the correct attributes', async () => {
    assert.strictEqual(store.name, 'JD Sports London');
    assert.strictEqual(store.address, 'Oxford Street');
    assert.strictEqual(store.city, 'London');
    assert.strictEqual(store.state, 'London');
    assert.strictEqual(store.country, 'UK');
    assert.strictEqual(store.zip, '12345');
  });
});

