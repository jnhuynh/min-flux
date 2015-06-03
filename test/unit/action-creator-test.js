'use strict';

var MinFlux = require('../../index');
var expect = require('chai').expect;

describe('ActionCreator', () => {
  describe('create', () => {
    it('returns an object with properties in spec', () => {
      var actionCreator =  new MinFlux.ActionCreator({
        actionTypes: {
          HI: null,
          HOW_DO_YOU_DO: null,
          A1A: null,
        },
        aString: 'hi',
        aFunc: function() {},
      });

      expect(actionCreator.dispatch).to.be.a('function');

      expect(actionCreator.aFunc).to.be.a('function');
      expect(actionCreator.aString).to.be.a('string');
    });

    context('when spec argument has a dispatch property', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.ActionCreator({
            actionTypes: {},
            dispatch: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when actionTypes is a hash of values are null', () => {
      it('returns an object with actionTypes whose values are strings of the keys', () => {
        var actionCreator = new MinFlux.ActionCreator({
          actionTypes: {
            HI: null,
            HOW_DO_YOU_DO: null,
            A1A: null,
          },
        });

        expect(actionCreator.actionTypes).to.eql({
          HI: 'HI',
          HOW_DO_YOU_DO: 'HOW_DO_YOU_DO',
          A1A: 'A1A',
        });
      });
    });

    context('when actionTypes is a hash of non null values', () => {
      it('returns an object with actionTypes whose values are strings of the keys', () => {
        var actionCreator = new MinFlux.ActionCreator({
          actionTypes: {
            HI: 'yo',
            HOW_DO_YOU_DO: 'good',
            A1A: 1,
          },
        });

        expect(actionCreator.actionTypes).to.eql({
          HI: 'HI',
          HOW_DO_YOU_DO: 'HOW_DO_YOU_DO',
          A1A: 'A1A',
        });
      });
    });

    context('when actionTypes property is missing from spec argument', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.ActionCreator({});
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument is missing', () => {
      it('throws an error', () => {
        var createFail = () => {
          new MinFlux.ActionCreator();
        };

        expect(createFail).to.throw(Error);
      });
    });
  });

  describe('dispatch', () => {
    var actionCreator;

    beforeEach(() => {
      actionCreator = new MinFlux.ActionCreator({
        actionTypes: {
          HI: null,
        }
      });
    });

    it('dispatches with an action object that has type and payload propertes', (done) => {
      MinFlux.Dispatcher.register((action) => {
        expect(action.type).to.equal('HI');
        expect(action.payload).to.equal('yo');
        done();
      });

      actionCreator.dispatch('HI', 'yo');
    });

    context('when actionType argument is not a string', () => {
      it('throws an error', () => {
        var dispatchFail = () => {
          actionCreator.dispatch();
        };

        expect(dispatchFail).to.throw(Error);
      });
    });

    context('when actionType argument is not in hash of actionTypes', () => {
      it('throws an error', () => {
        var dispatchFail = () => {
          actionCreator.dispatch('bye');
        };

        expect(dispatchFail).to.throw(Error);
      });
    });

    context('when actionType argument is not the same case as known actionType', () => {
      it('throws an error', () => {
        var dispatchFail = () => {
          actionCreator.dispatch('hi');
        };

        expect(dispatchFail).to.throw(Error);
      });
    });
  });
});

