'use strict';

var expect = require('chai').expect;
var bbtree = require('../lib');

describe('bbtree', function () {
  it('should export function createTree', function () {
    expect(bbtree).to.respondTo('createTree');
  });
});
