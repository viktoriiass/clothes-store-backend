let nextItemId = 1;

module.exports = {
  inventory: [],
  basket: [],
  getNextItemId() {
    return nextItemId++;
  }
};
