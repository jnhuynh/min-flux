# Philosophy

MinFlux is a minimal, convention based framework for creating [React][react] and
[React-Native][react-native] applications with the [Flux][flux] architecture.

This framework is written with ES2015 syntax via [Babel][babel]. It uses
[Gulp][gulp] running tasks like testing and building. We use [Mocha][1] as our
testing framework and [Chai][2] as our test assertion library.

### Vocabulary

`Components` are [React][react] components. Their sole responsiblity is to
render a UI and update said UI whenever their state or props change.
`Components` get the data necessary for their state from `Stores`.

Each `Store` is a single source of truth for a specific domain of an
application. Multiple `Stores` can, and probably will, exist within one
application. They house, fetch, persist, and modify data from user interactions,
web APIs, and etc. They expose methods to query for this data.

`ActionCreators` are `Component` accessible events triggers. They are the only
way to cause data change within the application. The events they trigger are
`ActionTypes`.

These `ActionTypes` and additional needed data are passed to the `Dispatcher`.
The `Dispatcher` is the publisher/subcriber manager. It broadcasts the
`ActionTypes` and additional needed data to all `Stores` that subsribed to it.
Multiple `Stores` may respond to one `ActionType`, it is up to the store to
decide what to do when it receives an `ActionType` notification.

### Flow

We believe in a unidirectional flow of data.

1. `Components` are responsible for rendering logic and cannot manipulate state
   directly
2. `Components` subscribe to change event from any number of `Stores`
3. `ActionCreators` expose methods to dispatch `ActionTypes` via the
   `Dispatcher`
4. `Components`, as necessary, invoke those methods on `ActionCreators` upon
   initial presentation and user interaction
5. `Dispatcher` broadcasts the `ActionTypes` to all `Stores`
5. `Stores` get notified of new `ActionType` requests and update data as
   necessary
6. `Stores` notifiy all subscribed `Components` of change event if there was any
   change to data
7. `Components` upon change notification from any of the `Stores` they
   subscribed to, update state by querying those `Stores` for new data
8. `Components` rerender themselves if their state changed

### Benefits

- Since `Stores` are the ones managing the data, all components that subscribe
  to a particular `Store` will share the same data. There will be no conflicting
  component since state since all `Component` states are facets of the data that
  comes from the store.
- `Stores`, `ActionCreators`, and `Dispatcher` are `Component` independent, so
  multiple `Components` can leverage the same action triggers and data query
  methods.
- `Components` never directly change data so, debugging is just a matter of
  following the flow of actions.

# Installation

```
$ npm install [--save] min-flux
```

# Example

```js
// ThreadStore.js
'use strict';

var MinFlux = require('min-flux');
var ActionCreator = require('./action-creator');

module.exports = new MinFlux.Store({
  // Component accessible query method
  getAllThreads() {
    var result = Object.keys(this._data).map((key) => {
      return ImmutableCopy(this._data[key]);
    });

    return result;
  },

  // Component accessible query method
  getSelectedThread() {
    return ImmutableCopy(this.selectedThread);
  },

  _fetchThreads() {
    var aPromise = // AJAX, AsyncStorage, WebSockets, whatever to fetch new data
    aPromise.then((payload) => {
      // Update our internal data house with new data
      this._data = payload;

      // Emit a change event for all of our subscribed Components
      this.emitChange();
    })
  },

  _selectedThread: null,
  _selectThread(threadID) {
    this._selectedThread = this._data[threadID];

    // Emit a change event for all of our subscribed Components
    this.emitChange();
  },

  /**
   * The keys within actionTypeHandlers MUST match the ActionType that it is
   * trying to handle.
   */
  actionTypeHandlers: {
    FETCH_THREADS(action) {
      this._fetchThreads();
    },

    SELECT_THREAD(action) {
      this._selectThread(action.payload.threadID);
    },
  },
});

// ThreadActionCreator
'use strict';

var MinFlux = require('min-flux');

module.exports = new MinFlux.ActionCreator({
  /**
   * These are ActionTypes. All Stores that want to handle them, must have
   * corresponding properties in their actionTypeHandlers hash.
   */
  actionTypes: {
    FETCH_THREADS: null,
    SELECT_THREAD: null,
  },

  selectThread(threadID) {
    this.dispatch(this.actionTypes.SELECT_THREAD, {
      threadID: threadID,
    });
  },

  fetchThreads() {
    this.dispatch(this.actionTypes.FETCH_THREADS);
  },
});

// Component.js
'use strict';

var ThreadActionCreator = require('./ThreadActionCreator');
var ThreadStore = require('./ThreadStore');

var React = require('react-native');
var {
  View,
  Component,
  TouchableHighlight,
} = React;

module.exports = React.createClass({
  componentDidMount() {
    // Subscribe to ThreadStore change event
    ThreadStore.addChangeListener(this._onChange.bind(this));
  },

  componentWillUnmount() {
    // Unsubscribe to ThreadStore change event
    ThreadStore.removeChangeListener(this._onChange.bind(this));
  },

  _onChange() {
    var threads = ThreadStore.getAllThreads();
    var selectedThread = ThreadStore.getSelectedThread();

    // Update our state so that UI is rerendered
    this.setState({
      threads: threads,
      selectedThread: selectedThread,
    });
  },

  _onPress(threadID) {
    ThreadActionCreator.selectThread(threadID);
  },

  render() {
    var threads = this.state.threads;
    var selectedThread = this.state.selectedThread;

    var threadsUI = threads.forEach((thread) => {
      return (
        <TouchableHighlight onPress={() => this._onPress(thread.id) }>
          <Text>{thread.name}</Text>
        </TouchableHighlight>
      );
    });

    return (
      <View>
        <Text>Selected Thread: {selectedThread.name}<Text>
      </View>
      <View>
        {threadsUI}
      </View>
    );
  },
});
```

# API

### MiniFlux.Store

##### MiniFlux.Store(spec)

```js
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
```

##### MiniFlux.Store._data

```js
/**
 * Hash used to house the Store's data. Only interact with this in your Store
 * instance
 *
 * @private
 * @property _data
 */
```

##### MiniFlux.Store.emitChange()

```js
/**
 * Emits the change event which will trigger all the registered callbacks.
 *
 * @method emitChange
 * @return {MinFlux.Store}
 */
```

##### MinFlux.Store.addChangeListener(callback)

```js
/**
 * Registers a callback to the Store's change event.
 *
 * @method addChangeListener
 * @param callback {Function} the callback that will be registered
 * @return {MinFlux.Store}
 */
```

##### MinFlux.Store.removeChangeListener(callback)

```js
/**
 * Removes a registered callback from the Store's change event.
 *
 * @method removeChangeListener
 * @param callback {Function} the callback that was registered prior
 * @return {MinFlux.Store}
 */
```

### MiniFlux.ActionCreator

##### MinFlux.ActionCreator(spec)

```js
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
```

##### ActionCreator.actionTypes

```js
/**
 * A hash of string constants that are used to broadcasts actions to Stores.
 *
 * @property actionTypes
 * @type {Object}
 * @default {}
 */
```

##### MiniFlux.ActionCreator.dispatch(actionType, payload)

```js
/**
 * Broadcasts an action type and payload for consumption by Stores.
 *
 * @method dispatch
 * @param actionType {Object} an action type from the action types hash
 * @param payload {Object} data to send along with action
 * @return {MinFlux.ActionCreator}
 */
```

### MiniFlux.Dispatcher

This just a singleton of Facebook's Flux dispatcher. Refer to [HERE][dispatcher]
for the documentation. You **shouldn't** have to interact with this singleton
directly.

# Contributing to MinFlux

Fork `git@github.com:jnhuynh/min-flux.git`, clone your new fork.

```
$ cd min-flux
$ npm install
$ npm install -g gulp
$ npm install -g mocha
```

### Testing MinFlux

For one test run:

```
$ gulp test

or

$ gulp
```

For live reloading:

```
$ gulp live-test
```

### Building MinFlux

```
$ gulp build
```

[mocha]:http://mochajs.org/
[chai]:http://chaijs.com/
[react]:http://facebook.github.io/react/
[react-native]:https://facebook.github.io/react-native/
[flux]:https://facebook.github.io/flux/
[dispatcher]:https://facebook.github.io/flux/docs/dispatcher.html#content
[babel]:https://babeljs.io/
[gulp]:http://gulpjs.com/
