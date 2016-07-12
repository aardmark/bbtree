'use strict';

var expect = require('chai').expect;
var bbtree = require('../lib');

describe('bbtree', function () {
  it('should export function createTree', function () {
    expect(bbtree).to.respondTo('createTree');
  });
});

describe('tree', function () {
  describe('#insert', function () {
    it('should insert a key value pair', function () {
      let tree = bbtree.createTree();
      tree.insert(1, 'one');
      tree.insert(-1, 'minus one');
      expect(tree.root.key).to.equal(1);
      expect(tree.root.value).to.equal('one');
      expect(tree.root.left.key).to.equal(-1);
      expect(tree.root.left.value).to.equal('minus one');
    });
  });
});
