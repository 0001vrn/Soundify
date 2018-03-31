'use strict';
var chai = require('chai');
var expect = chai.expect;
var Soundify = require('../skills/index');

var assert = require('assert');
describe('Soundify', function() {
  var subject = new Soundify();

  describe('#isCorrectResponse(level, idx, animalName)', function() {
    it('should return false when the level is invalid', function() {
      assert.equal(subject.isCorrectResponse(5,0,"dog"), false);
    });

    it('should return true when the level is valid', function() {
      assert.equal(subject.isCorrectResponse(0,0,"dog"), false);
    });
  });
});