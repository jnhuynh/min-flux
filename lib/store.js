'use strict';

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'MIN_FLUX_STORE_CHANGE';

var _storeSpec = {
  /**
   * Hash used to house the Store's data.
   *
   * @private
   * @property _data
   */
  _data: {},

  /**
   * Emits the change event which will trigger all the registered callbacks.
   *
   * @method emitChange
   * @return {MinFlux.Store}
   */
  emitChange() {
    this.emit(CHANGE_EVENT);

    return this;
  },

  /**
   * Registers a callback to the Store's change event.
   *
   * @method addChangeListener
   * @param callback {Function} the callback that will be registered
   * @return {MinFlux.Store}
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);

    return this;
  },

  /**
   * Removes a registered callback from the Store's change event.
   *
   * @method removeChangeListener
   * @param callback {Function} the callback that was registered prior
   * @return {MinFlux.Store}
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);

    return this;
  },

  dispatchToken: null,
};

var Store = {
  /**
   * Factory function to instantiate new MinFlux.Store.
   *
   * Registers a callback to the dispatcher that will map an incoming action
   * type to an action type handler if it is found in the spec. It will set the
   * dispatchToken property.
   *
   * @method create
   * @param spec {Object} custom properties for new ActionCreator instance
   * @return {MinFlux.ActionCreator}
   */
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
