# Philosophy

MinFlux is a minimal, convention based framework for creating [React][react] and
[React-Native][react-native] applications with the [Flux][flux] architecture.

We believe in the a unidirectional flow of data.

1. `Components` are responsible for rendering logic and cannot manipulate state directly
2. `Components` subscribe to any number of `Stores` change event
3. `Components` invoke methods on `ActionCreators`
4. `ActionCreator` methods dispatch `ActionTypes` via the `Dispatcher`
5. `Dispatcher` broadcasts the `ActionTypes` to all `Stores`
5. `Stores` get notified of new `ActionType` request and update data as necessary
6. `Stores` notifiy all subscribed components of change event if there was any
   change to data
7. `Components` upon `Store` change notification update state by querying
   `Stores` for new data.
8. `Components` rerender themselves if their state changed

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
