'use strict';

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'min-flux-store-change';

var _storeSpec = {
  _data: {},

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatchToken: null,
};

var Store = {
  create(spec) {
    var newStore = assign({}, EventEmitter.prototype, _storeSpec, spec);

    var dispatchToken = Dispatcher.register((action) => {
      var callback = newStore.actionTypeHandlers[action.type];

      if (!!callback) {
        callback.apply(newStore, [action]);
      }
    });

    newStore.dispatchToken = dispatchToken;

    return newStore;
  },
};

module.exports = Store;
