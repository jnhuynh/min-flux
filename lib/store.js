'use strict';

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'MIN_FLUX_STORE_CHANGE';
var RESERVED_KEYS = ['addChangeListener', 'removeChangeListener', 'emitChange'];

/**
 * Constructor function for new MinFlux.Store.
 *
 * Registers a callback to the dispatcher that will map an incoming action
 * type to an action type handler if it is found in the spec. It will set the
 * dispatchToken property.
 *
 * @method create
 * @param spec {Object} custom properties for new ActionCreator instance
 * @return {MinFlux.ActionCreator}
 */
function Store(spec) {
  if (!(this instanceof Store)) {
    throw new Error('Constructor called as a function, use new keyword');
  }

  spec = !!spec ? spec : {};
  spec.actionTypeHandlers = !!spec.actionTypeHandlers ? spec.actionTypeHandlers : {};

  RESERVED_KEYS.forEach((key) => {
    if (!!spec[key]) {
      throw new Error('Overwriting of MinFlux.Store.' + key + ' not allowed');
    }
  });

  Object.keys(spec).forEach((key) => {
    this[key] = spec[key];
  });

  this.dispatchToken = Dispatcher.register((action) => {
    var callback = this.actionTypeHandlers[action.type];

    if (!!callback) {
      callback.apply(this, [action]);
    }
  });

  return this;
};

Store.prototype = EventEmitter.prototype;

/**
 * Hash used to house the Store's data. Only interact with this in your Store
 * instance
 *
 * @private
 * @property _data
 */
Store.prototype._data = {};

/**
 * Emits the change event which will trigger all the registered callbacks.
 *
 * @method emitChange
 * @return {MinFlux.Store}
 */
Store.prototype.emitChange = function emitChange() {
  this.emit(CHANGE_EVENT);

  return this;
};

/**
 * Registers a callback to the Store's change event.
 *
 * @method addChangeListener
 * @param callback {Function} the callback that will be registered
 * @return {MinFlux.Store}
 */
Store.prototype.addChangeListener = function addChangeListener(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Expected callback to be a function');
  }

  this.on(CHANGE_EVENT, callback);

  return this;
};

/**
 * Removes a registered callback from the Store's change event.
 *
 * @method removeChangeListener
 * @param callback {Function} the callback that was registered prior
 * @return {MinFlux.Store}
 */
Store.prototype.removeChangeListener = function removeChangeListener(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Expected callback to be a function');
  }

  this.removeListener(CHANGE_EVENT, callback);

  return this;
};

module.exports = Store;
