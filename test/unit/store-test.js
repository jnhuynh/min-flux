'use strict';

var MinFlux = require('../../index');
var expect = require('chai').expect;

describe('Store', () => {
  describe('constructor', () => {
    it('returns an object with properties in spec', () => {
      var store = new MinFlux.Store({
        actionTypeHanders: {
          YO: function() {},
        },

        aString: 'hi',
        aFunc: function() {},
      });

      expect(store.addChangeListener).to.be.a('function');
      expect(store.removeChangeListener).to.be.a('function');
      expect(store.emitChange).to.be.a('function');

      expect(store.actionTypeHanders).to.be.a('object');
      expect(store.aString).to.be.a('string');
      expect(store.aFunc).to.be.a('function');
    });

    it('returns an object a dispatchToken property set', () => {
      var store = new MinFlux.Store({
        actionTypeHanders: {
          YO: function() {},
        },
      });

      expect(store.dispatchToken).to.exist;
    });

    context('when spec argument has a addChangeListener property', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.Store({
            addChangeListener: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument has a removeChangeListener property', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.Store({
            removeChangeListener: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument has a emitChange property', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.Store({
            emitChange: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });
  });

  describe('addChangeListener', () => {
    var store;

    beforeEach(() => {
      store = new MinFlux.Store({});
    });

    context('when the callback argument is not a function', () => {
      it('throws an error', () => {
        var addFail = () => {
          store.addChangeListener('hi');
        };

        expect(addFail).to.throw(Error);
      });
    });

    it('returns the store for chaining', () => {
      var result = store.addChangeListener(() => {});

      expect(result).to.equal(store);
    });
  });

  describe('removeChangeListener', () => {
    var store;

    beforeEach(() => {
      store = new MinFlux.Store({});
    });

    context('when the callback argument is not a function', () => {
      it('throws an error', () => {
        var removeFail = () => {
          store.removeChangeListener('hi');
        };

        expect(removeFail).to.throw(Error);
      });
    });

    it('returns the store for chaining', () => {
      var result = store.removeChangeListener(() => {});

      expect(result).to.equal(store);
    });
  });
});

