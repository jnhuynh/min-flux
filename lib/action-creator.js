'use strict';

var Dispatcher = require('./dispatcher');
var KeyMirror = require('keymirror');
var assign = require('object-assign');

var _actionCreatorSpec = {
  actionTypes: {},

  dispatch(actionType, payload) {
    if (!(typeof actionType === 'string')) {
        throw new Error('Expected actionType argument to be a string');
    }

    Dispatcher.dispatch({
      type: actionType,
      payload: payload,
    });
  },
};

var ActionCreator = {
  create(spec) {
    var actionTypes = spec.actionTypes;

    if (!actionTypes || !(actionTypes instanceof Object)) {
        throw new Error('Expected actionTypes property to be a map');
    }

    spec.actionTypes = KeyMirror(actionTypes);

    var newActionCreator = assign({}, _actionCreatorSpec, spec);

    return newActionCreator;
  }
};

module.exports = ActionCreator;
