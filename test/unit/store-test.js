'use strict';

var MinFlux = require('../../index');
var expect = require('chai').expect;

describe('ActionCreator', () => {
  describe('create', () => {
    it('returns an object with properties in spec', () => {
      var actionCreator =  MinFlux.ActionCreator.create({
        actionTypes: {
          HI: null,
          HOW_DO_YOU_DO: null,
          A1A: null,
        },
      });

      expect(actionCreator.dispatch).to.be.a('function');
    });

    context('when spec argument has a dispatch property', () => {
      it('throws an error', () => {
        var createFail = () => {
          MinFlux.ActionCreator.create({
            actionTypes: {},
            dispatch: 'hi',
          });
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when actionTypes is a hash of values are null', () => {
      it('returns an object with actionTypes whose values are strings of the keys', () => {
        var actionCreator = MinFlux.ActionCreator.create({
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
        var actionCreator = MinFlux.ActionCreator.create({
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
          MinFlux.ActionCreator.create({});
        };

        expect(createFail).to.throw(Error);
      });
    });

    context('when spec argument is missing', () => {
      it('throws an error', () => {
        var createFail = () => {
          MinFlux.ActionCreator.create();
        };

        expect(createFail).to.throw(Error);
      });
    });
  });
});

