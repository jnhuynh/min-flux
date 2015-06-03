/**
 * Singleton of Facebook's Flux Dispatcher. It's essentially a pub/sub util
 * with support for waiting for other subscribers to finish.
 */

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();
