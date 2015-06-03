'use strict';

var Dispatcher = require('./dispatcher');
var KeyMirror = require('keymirror');

var RESERVED_KEYS = ['dispatch'];

/**
 * Constructor function for new MinFlux.ActionCreator.
 *
 * It accepts a spec argument. It must contain an actionTypes property. It must
 * be a hash. They keys are the constants used for action type. The values must
 * be null.
 *
 * {
 *   ACTION_TYPE_1: null,
 *   ACTION_TYPE_2: null,
 *   ...,
 *   ACTION_TYPE_N: null,
 * }
 *
 * @method create
 * @param spec {Object} custom properties for new ActionCreator instance
 * @return {MinFlux.ActionCreator}
 */
function ActionCreator(spec) {
  spec = !!spec ? spec : {};

  RESERVED_KEYS.forEach((key) => {
    if (!!spec[key]) {
      throw new Error('Overwriting of MinFlux.Store.' + key + ' not allowed');
    }
  });

  var actionTypes = spec.actionTypes;

  if (!actionTypes || !(actionTypes instanceof Object)) {
      throw new Error('Expected actionTypes property to be a hash');
  }

  spec.actionTypes = KeyMirror(actionTypes);

  Object.keys(spec).forEach((key) => {
    this[key] = spec[key];
  });

  return this;
};

/**
 * A hash of string constants that are used to broadcasts actions to Stores.
 *
 * @property actionTypes
 * @type {Object}
 * @default {}
 */
ActionCreator.prototype.actionTypes = {};

/**
 * Broadcasts an action type and payload for consumption by Stores.
 *
 * @method dispatch
 * @param actionType {Object} an action type from the action types hash
 * @param payload {Object} data to send along with action
 * @return {MinFlux.ActionCreator}
 */
ActionCreator.prototype.dispatch = function dispatch(actionType, payload) {
  if (typeof actionType !== 'string') {
      throw new Error('Expected actionType argument to be a string');
  }

  if (Object.keys(this.actionTypes).indexOf(actionType) === -1) {
      throw new Error('Unknown actionType argument, not found in actionTypes hash property');
  }

  Dispatcher.dispatch({
    type: actionType,
    payload: payload,
  });

  return this;
};

module.exports = ActionCreator;
