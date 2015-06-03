# Philosophy

MinFlux is a minimal, convention based framework for creating [React][react] and
[React-Native][react-native] applications with the [Flux][flux] architecture.

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

# Contributing to MinFlux

Fork `git@github.com:jnhuynh/min-flux.git`, clone your new fork.

```
$ cd min-flux
$ npm install
$ npm install -g gulp
$ npm install -g mocha
```

We use [Mocha][1] as our testing framework and [Chai][2] as our test assertion
library.

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
