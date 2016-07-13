'use strict';

let expect = require('chai').expect;
let bbtree = require('../lib');

describe('bbtree', function () {
  it('should export function createTree', function () {
    expect(bbtree).to.respondTo('createTree');
  });
});

describe('tree', function () {
  describe('#insert()', function () {
    it('should insert a key value pair', function () {
      let tree = bbtree.createTree();
      tree.insert(1, 'one');
      tree.insert(-1, 'minus one');
      expect(tree.get(1).key).to.equal(1);
      expect(tree.get(1).value).to.equal('one');
      expect(tree.get(-1).key).to.equal(-1);
      expect(tree.get(-1).value).to.equal('minus one');
    });
    it('should not insert a duplicate key', function () {
      let tree = bbtree.createTree();
      tree.insert(1, 'one');
      tree.insert(10, 'ten');
      tree.insert(1, 'another one');
      tree.insert(9, 'nine');
      tree.insert(5, 'five');
      tree.insert(2, 'two');
      expect(tree.count()).to.equal(5);
      let existing = tree.get(1);
      expect(existing.value).to.equal('one');
    });
  });

  describe('#get()', function () {
    it('should return null for an empty tree', function () {
      let tree = bbtree.createTree();
      let result = tree.get(1);
      expect(result).to.be.a('null');
    });
    it('should return null for a key that does not exist', function () {
      let tree = bbtree.createTree();
      let data = [50, 40, 30, 20, 10, 25];
      data.forEach((value) => tree.insert(value));
      let result = tree.get(1);
      expect(result).to.be.a('null');
    });
    it('should return a key value pair for a key that does exist', function () {
      let tree = bbtree.createTree();
      let data = [50, 40, 30, 20, 10, 25];
      data.forEach((value) => tree.insert(value, 'number ' + value));
      for (let ix = 0; ix < data.length; ix++) {
        let result = tree.get(data[ix]);
        expect(result.key).to.equal(data[ix]);
        expect(result.value).to.equal('number ' + data[ix]);
      }
    });
  });

  describe('#traverseInOrder()', function () {
    it('should traverse the tree in order', function () {
      let tree = bbtree.createTree();
      let data = [50, 40, 30, 20, 10, 25];
      data.forEach((value) => tree.insert(value));
      let inOrder = [];
      tree.traverseInOrder((key) => { inOrder.push(key); });
      let sortedData = data.sort((a, b) => { return a - b; });
      expect(inOrder).to.deep.equal(sortedData);
    });
  });

  describe('#count()', function () {
    it('should return zero for an empty tree', function () {
      let tree = bbtree.createTree();
      expect(tree.count()).to.equal(0);
    });
    it('should return the number of nodes', function () {
      let tree = bbtree.createTree();
      for (let ix = 0; ix < 100; ix++) {
        tree.insert(ix);
      }
      expect(tree.count()).to.equal(100);
    });
  });

  describe('#delete()', function () {
    it('should not delete a non existant key', function () {
      let tree = bbtree.createTree();
      tree.delete(1);
      expect(tree.count()).to.equal(0);
      [9,5,10,0,8,11,-1,1,2].forEach((key) => tree.insert(key));
      let count = tree.count();
      tree.delete(42);
      expect(tree.count()).to.equal(count);
    });
    it('should delete the correct node', function () {
      let tree = bbtree.createTree();
      let data = [9,5,10,0,8,11,-1,1,2];
      data.forEach((key) => tree.insert(key));
      let size = tree.count();
      data.forEach((key) => {
        tree.delete(key);
        expect(tree.get(key)).to.be.a('null');
        expect(tree.count()).to.equal(--size);
      });
      expect(tree.count()).to.equal(0);
    });
  });
});
