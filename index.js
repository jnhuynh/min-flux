var Dispatcher = require('./lib/dispatcher');
var Store = require('./lib/store');
var ActionCreator = require('./lib/action-creator');

var MinFlux = {
  Dispatcher: Dispatcher,
  Store: Store,
  ActionCreator: ActionCreator,
};

module.exports = MinFlux;
