const { DataStore } = require('notarealdb');

const store = new DataStore("./data");

module.exports = {
  test:store.collection('test')
};
