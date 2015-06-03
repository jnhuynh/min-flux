'use strict';

var MinFlux = require('../../index');
var expect = require('chai').expect;

describe('Store', () => {
  describe('create', () => {
    it('returns an object with properties in spec', () => {
      var store =  MinFlux.Store.create({
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
      var store =  MinFlux.Store.create({
        actionTypeHanders: {
          YO: function() {},
        },
      });

      expect(store.dispatchToken).to.exist;
    });

    context('when spec argument has a addChangeListener property', () => {
      it('throws an error', () => {
        var createFail = () => {
          MinFlux.Store.create({
            addChangeListener: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument has a removeChangeListener property', () => {
      it('throws an error', () => {
        var createFail = () => {
          MinFlux.Store.create({
            removeChangeListener: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument has a emitChange property', () => {
      it('throws an error', () => {
        var createFail = () => {
          MinFlux.Store.create({
            emitChange: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });
  });
});

