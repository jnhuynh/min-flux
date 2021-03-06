"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    var Dispatcher = require("./lib/dispatcher");
    var Store = require("./lib/store");
    var ActionCreator = require("./lib/action-creator");

    var MinFlux = {
      Dispatcher: Dispatcher,
      Store: Store,
      ActionCreator: ActionCreator };

    module.exports = MinFlux;
  }, { "./lib/action-creator": 2, "./lib/dispatcher": 3, "./lib/store": 4 }], 2: [function (require, module, exports) {
    "use strict";

    var Dispatcher = require("./dispatcher");
    var KeyMirror = require("keymirror");

    var RESERVED_KEYS = ["dispatch"];

    /**
     * Constructor function for new MinFlux.ActionCreator.
     *
     * It must contain an actionTypes property. It must be a hash. They keys are
     * the constants used for action type. The values must be null.
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
      var _this = this;

      spec = !!spec ? spec : {};

      RESERVED_KEYS.forEach(function (key) {
        if (!!spec[key]) {
          throw new Error("Overwriting of MinFlux.Store." + key + " not allowed");
        }
      });

      var actionTypes = spec.actionTypes;

      if (!actionTypes || !(actionTypes instanceof Object)) {
        throw new Error("Expected actionTypes property to be a hash");
      }

      spec.actionTypes = KeyMirror(actionTypes);

      Object.keys(spec).forEach(function (key) {
        _this[key] = spec[key];
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
      if (typeof actionType !== "string") {
        throw new Error("Expected actionType argument to be a string");
      }

      if (Object.keys(this.actionTypes).indexOf(actionType) === -1) {
        throw new Error("Unknown actionType argument, not found in actionTypes hash property");
      }

      Dispatcher.dispatch({
        type: actionType,
        payload: payload });

      return this;
    };

    module.exports = ActionCreator;
  }, { "./dispatcher": 3, "keymirror": 9 }], 3: [function (require, module, exports) {
    /**
     * Singleton of Facebook's Flux Dispatcher. It's essentially a pub/sub util
     * with support for waiting for other subscribers to finish.
     */

    var Dispatcher = require("flux").Dispatcher;

    module.exports = new Dispatcher();
  }, { "flux": 6 }], 4: [function (require, module, exports) {
    "use strict";

    var Dispatcher = require("./dispatcher");
    var EventEmitter = require("events").EventEmitter;

    var CHANGE_EVENT = "MIN_FLUX_STORE_CHANGE";
    var RESERVED_KEYS = ["addChangeListener", "removeChangeListener", "emitChange"];

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
      var _this2 = this;

      if (!(this instanceof Store)) {
        throw new Error("Constructor called as a function, use new keyword");
      }

      spec = !!spec ? spec : {};
      spec.actionTypeHandlers = !!spec.actionTypeHandlers ? spec.actionTypeHandlers : {};

      RESERVED_KEYS.forEach(function (key) {
        if (!!spec[key]) {
          throw new Error("Overwriting of MinFlux.Store." + key + " not allowed");
        }
      });

      Object.keys(spec).forEach(function (key) {
        _this2[key] = spec[key];
      });

      this.dispatchToken = Dispatcher.register(function (action) {
        var callback = _this2.actionTypeHandlers[action.type];

        if (!!callback) {
          callback.apply(_this2, [action]);
        }
      });

      return this;
    };

    Store.prototype = EventEmitter.prototype;

    /**
     * Hash used to house the Store's data.
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
      if (typeof callback !== "function") {
        throw new Error("Expected callback to be a function");
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
      if (typeof callback !== "function") {
        throw new Error("Expected callback to be a function");
      }

      this.removeListener(CHANGE_EVENT, callback);

      return this;
    };

    module.exports = Store;
  }, { "./dispatcher": 3, "events": 5 }], 5: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function (n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };

    EventEmitter.prototype.emit = function (type) {
      var er, handler, len, args, i, listeners;

      if (!this._events) this._events = {};

      // If there is no 'error' event listener then throw.
      if (type === "error") {
        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
          er = arguments[1];
          if (er instanceof Error) {
            throw er; // Unhandled 'error' event
          }
          throw TypeError("Uncaught, unspecified \"error\" event.");
        }
      }

      handler = this._events[type];

      if (isUndefined(handler)) return false;

      if (isFunction(handler)) {
        switch (arguments.length) {
          // fast cases
          case 1:
            handler.call(this);
            break;
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            len = arguments.length;
            args = new Array(len - 1);
            for (i = 1; i < len; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      } else if (isObject(handler)) {
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++) args[i - 1] = arguments[i];

        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }

      return true;
    };

    EventEmitter.prototype.addListener = function (type, listener) {
      var m;

      if (!isFunction(listener)) throw TypeError("listener must be a function");

      if (!this._events) this._events = {};

      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (this._events.newListener) this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);

      if (!this._events[type])
        // Optimize the case of one listener. Don't need the extra array object.
        this._events[type] = listener;else if (isObject(this._events[type]))
        // If we've already got an array, just append.
        this._events[type].push(listener);else
        // Adding the second element, need to change to array.
        this._events[type] = [this._events[type], listener];

      // Check for listener leak
      if (isObject(this._events[type]) && !this._events[type].warned) {
        var m;
        if (!isUndefined(this._maxListeners)) {
          m = this._maxListeners;
        } else {
          m = EventEmitter.defaultMaxListeners;
        }

        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          if (typeof console.trace === "function") {
            // not supported in IE 10
            console.trace();
          }
        }
      }

      return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function (type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");

      var fired = false;

      function g() {
        this.removeListener(type, g);

        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }

      g.listener = listener;
      this.on(type, g);

      return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function (type, listener) {
      var list, position, length, i;

      if (!isFunction(listener)) throw TypeError("listener must be a function");

      if (!this._events || !this._events[type]) return this;

      list = this._events[type];
      length = list.length;
      position = -1;

      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        if (this._events.removeListener) this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0;) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            position = i;
            break;
          }
        }

        if (position < 0) return this;

        if (list.length === 1) {
          list.length = 0;
          delete this._events[type];
        } else {
          list.splice(position, 1);
        }

        if (this._events.removeListener) this.emit("removeListener", type, listener);
      }

      return this;
    };

    EventEmitter.prototype.removeAllListeners = function (type) {
      var key, listeners;

      if (!this._events) return this;

      // not listening for removeListener, no need to emit
      if (!this._events.removeListener) {
        if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        for (key in this._events) {
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }

      listeners = this._events[type];

      if (isFunction(listeners)) {
        this.removeListener(type, listeners);
      } else {
        // LIFO order
        while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      }
      delete this._events[type];

      return this;
    };

    EventEmitter.prototype.listeners = function (type) {
      var ret;
      if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
      return ret;
    };

    EventEmitter.listenerCount = function (emitter, type) {
      var ret;
      if (!emitter._events || !emitter._events[type]) ret = 0;else if (isFunction(emitter._events[type])) ret = 1;else ret = emitter._events[type].length;
      return ret;
    };

    function isFunction(arg) {
      return typeof arg === "function";
    }

    function isNumber(arg) {
      return typeof arg === "number";
    }

    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }

    function isUndefined(arg) {
      return arg === void 0;
    }
  }, {}], 6: [function (require, module, exports) {
    /**
     * Copyright (c) 2014-2015, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     */

    module.exports.Dispatcher = require("./lib/Dispatcher");
  }, { "./lib/Dispatcher": 7 }], 7: [function (require, module, exports) {
    /*
     * Copyright (c) 2014, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @providesModule Dispatcher
     * @typechecks
     */

    "use strict";

    var invariant = require("./invariant");

    var _lastID = 1;
    var _prefix = "ID_";

    /**
     * Dispatcher is used to broadcast payloads to registered callbacks. This is
     * different from generic pub-sub systems in two ways:
     *
     *   1) Callbacks are not subscribed to particular events. Every payload is
     *      dispatched to every registered callback.
     *   2) Callbacks can be deferred in whole or part until other callbacks have
     *      been executed.
     *
     * For example, consider this hypothetical flight destination form, which
     * selects a default city when a country is selected:
     *
     *   var flightDispatcher = new Dispatcher();
     *
     *   // Keeps track of which country is selected
     *   var CountryStore = {country: null};
     *
     *   // Keeps track of which city is selected
     *   var CityStore = {city: null};
     *
     *   // Keeps track of the base flight price of the selected city
     *   var FlightPriceStore = {price: null}
     *
     * When a user changes the selected city, we dispatch the payload:
     *
     *   flightDispatcher.dispatch({
     *     actionType: 'city-update',
     *     selectedCity: 'paris'
     *   });
     *
     * This payload is digested by `CityStore`:
     *
     *   flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'city-update') {
     *       CityStore.city = payload.selectedCity;
     *     }
     *   });
     *
     * When the user selects a country, we dispatch the payload:
     *
     *   flightDispatcher.dispatch({
     *     actionType: 'country-update',
     *     selectedCountry: 'australia'
     *   });
     *
     * This payload is digested by both stores:
     *
     *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'country-update') {
     *       CountryStore.country = payload.selectedCountry;
     *     }
     *   });
     *
     * When the callback to update `CountryStore` is registered, we save a reference
     * to the returned token. Using this token with `waitFor()`, we can guarantee
     * that `CountryStore` is updated before the callback that updates `CityStore`
     * needs to query its data.
     *
     *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'country-update') {
     *       // `CountryStore.country` may not be updated.
     *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
     *       // `CountryStore.country` is now guaranteed to be updated.
     *
     *       // Select the default city for the new country
     *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
     *     }
     *   });
     *
     * The usage of `waitFor()` can be chained, for example:
     *
     *   FlightPriceStore.dispatchToken =
     *     flightDispatcher.register(function(payload) {
     *       switch (payload.actionType) {
     *         case 'country-update':
     *           flightDispatcher.waitFor([CityStore.dispatchToken]);
     *           FlightPriceStore.price =
     *             getFlightPriceStore(CountryStore.country, CityStore.city);
     *           break;
     *
     *         case 'city-update':
     *           FlightPriceStore.price =
     *             FlightPriceStore(CountryStore.country, CityStore.city);
     *           break;
     *     }
     *   });
     *
     * The `country-update` payload will be guaranteed to invoke the stores'
     * registered callbacks in order: `CountryStore`, `CityStore`, then
     * `FlightPriceStore`.
     */

    function Dispatcher() {
      this.$Dispatcher_callbacks = {};
      this.$Dispatcher_isPending = {};
      this.$Dispatcher_isHandled = {};
      this.$Dispatcher_isDispatching = false;
      this.$Dispatcher_pendingPayload = null;
    }

    /**
     * Registers a callback to be invoked with every dispatched payload. Returns
     * a token that can be used with `waitFor()`.
     *
     * @param {function} callback
     * @return {string}
     */
    Dispatcher.prototype.register = function (callback) {
      var id = _prefix + _lastID++;
      this.$Dispatcher_callbacks[id] = callback;
      return id;
    };

    /**
     * Removes a callback based on its token.
     *
     * @param {string} id
     */
    Dispatcher.prototype.unregister = function (id) {
      invariant(this.$Dispatcher_callbacks[id], "Dispatcher.unregister(...): `%s` does not map to a registered callback.", id);
      delete this.$Dispatcher_callbacks[id];
    };

    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     *
     * @param {array<string>} ids
     */
    Dispatcher.prototype.waitFor = function (ids) {
      invariant(this.$Dispatcher_isDispatching, "Dispatcher.waitFor(...): Must be invoked while dispatching.");
      for (var ii = 0; ii < ids.length; ii++) {
        var id = ids[ii];
        if (this.$Dispatcher_isPending[id]) {
          invariant(this.$Dispatcher_isHandled[id], "Dispatcher.waitFor(...): Circular dependency detected while " + "waiting for `%s`.", id);
          continue;
        }
        invariant(this.$Dispatcher_callbacks[id], "Dispatcher.waitFor(...): `%s` does not map to a registered callback.", id);
        this.$Dispatcher_invokeCallback(id);
      }
    };

    /**
     * Dispatches a payload to all registered callbacks.
     *
     * @param {object} payload
     */
    Dispatcher.prototype.dispatch = function (payload) {
      invariant(!this.$Dispatcher_isDispatching, "Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.");
      this.$Dispatcher_startDispatching(payload);
      try {
        for (var id in this.$Dispatcher_callbacks) {
          if (this.$Dispatcher_isPending[id]) {
            continue;
          }
          this.$Dispatcher_invokeCallback(id);
        }
      } finally {
        this.$Dispatcher_stopDispatching();
      }
    };

    /**
     * Is this Dispatcher currently dispatching.
     *
     * @return {boolean}
     */
    Dispatcher.prototype.isDispatching = function () {
      return this.$Dispatcher_isDispatching;
    };

    /**
     * Call the callback stored with the given id. Also do some internal
     * bookkeeping.
     *
     * @param {string} id
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_invokeCallback = function (id) {
      this.$Dispatcher_isPending[id] = true;
      this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
      this.$Dispatcher_isHandled[id] = true;
    };

    /**
     * Set up bookkeeping needed when dispatching.
     *
     * @param {object} payload
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_startDispatching = function (payload) {
      for (var id in this.$Dispatcher_callbacks) {
        this.$Dispatcher_isPending[id] = false;
        this.$Dispatcher_isHandled[id] = false;
      }
      this.$Dispatcher_pendingPayload = payload;
      this.$Dispatcher_isDispatching = true;
    };

    /**
     * Clear bookkeeping used for dispatching.
     *
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_stopDispatching = function () {
      this.$Dispatcher_pendingPayload = null;
      this.$Dispatcher_isDispatching = false;
    };

    module.exports = Dispatcher;
  }, { "./invariant": 8 }], 8: [function (require, module, exports) {
    /**
     * Copyright (c) 2014, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @providesModule invariant
     */

    "use strict";

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var invariant = function invariant(condition, format, a, b, c, d, e, f) {
      if (false) {
        if (format === undefined) {
          throw new Error("invariant requires an error message argument");
        }
      }

      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error("Minified exception occurred; use the non-minified dev environment " + "for the full error message and additional helpful warnings.");
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error("Invariant Violation: " + format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    };

    module.exports = invariant;
  }, {}], 9: [function (require, module, exports) {
    /**
     * Copyright 2013-2014 Facebook, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     */

    "use strict";

    /**
     * Constructs an enumeration with keys equal to their value.
     *
     * For example:
     *
     *   var COLORS = keyMirror({blue: null, red: null});
     *   var myColor = COLORS.blue;
     *   var isColorValid = !!COLORS[myColor];
     *
     * The last line could not be performed if the values of the generated enum were
     * not equal to their keys.
     *
     *   Input:  {key1: val1, key2: val2}
     *   Output: {key1: key1, key2: key2}
     *
     * @param {object} obj
     * @return {object}
     */
    var keyMirror = function keyMirror(obj) {
      var ret = {};
      var key;
      if (!(obj instanceof Object && !Array.isArray(obj))) {
        throw new Error("keyMirror(...): Argument must be an object.");
      }
      for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        ret[key] = key;
      }
      return ret;
    };

    module.exports = keyMirror;
  }, {}] }, {}, [1]);