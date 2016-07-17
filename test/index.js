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
      tree.insert(1);
      tree.insert(-1);
      expect(tree.get(1)).to.equal(1);
      expect(tree.get(-1)).to.equal(-1);
    });
    it('should not insert a duplicate key', function () {
      let tree = bbtree.createTree();
      tree.insert(1);
      tree.insert(10);
      tree.insert(1);
      tree.insert(9);
      tree.insert(5);
      tree.insert(2);
      expect(tree.count()).to.equal(5);
      expect(tree.get(1)).to.equal(1);
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
    it('should return the value for a key that does exist', function () {
      let tree = bbtree.createTree();
      let data = [50, 40, 30, 20, 10, 25];
      data.forEach((value) => tree.insert(value));
      for (let ix = 0; ix < data.length; ix++) {
        let result = tree.get(data[ix]);
        expect(result).to.equal(data[ix]);
      }
    });
  });

  describe('#traversePreOrder()', function () {
    it('should traverse the tree in pre order', function () {
      let tree = bbtree.createTree();
      let data = [0, 1, 2, 3, 4];
      let preOrderedData = [1, 0, 3, 2, 4];
      data.forEach((value) => tree.insert(value));
      let preOrder = [];
      tree.traversePreOrder((value) => { preOrder.push(value); });
      expect(preOrder).to.deep.equal(preOrderedData);
    });
  });

  describe('#traverseInOrder()', function () {
    it('should traverse the tree in order', function () {
      let tree = bbtree.createTree();
      let data = [50, 40, 30, 20, 10, 25];
      data.forEach((value) => tree.insert(value));
      let inOrder = [];
      tree.traverseInOrder((value) => { inOrder.push(value); });
      let sortedData = data.sort((a, b) => { return a - b; });
      expect(inOrder).to.deep.equal(sortedData);
    });
  });

  describe('#traversePostOrder()', function () {
    it('should traverse the tree in post order', function () {
      let tree = bbtree.createTree();
      let data = [0, 1, 2, 3, 4];
      let postOrderedData = [0, 2, 4, 3, 1];
      data.forEach((value) => tree.insert(value));
      let postOrder = [];
      tree.traversePostOrder((value) => { postOrder.push(value); });
      expect(postOrder).to.deep.equal(postOrderedData);
    });
  });

  describe('#count()', function () {
    it('should return zero for an empty tree', function () {
      let tree = bbtree.createTree();
      expect(tree.count()).to.equal(0);
    });
    it('should return the number of nodes', function () {
      let tree = bbtree.createTree();
      for (let ix = 0; ix < 42; ix++) {
        tree.insert(ix);
        expect(tree.count()).to.equal(ix + 1);
      }
    });
  });

  describe('#delete()', function () {
    it('should not delete a non existant key', function () {
      let tree = bbtree.createTree();
      tree.delete(1);
      expect(tree.count()).to.equal(0);
      [9, 5, 10, 0, 8, 11, -1, 1, 2].forEach((value) => tree.insert(value));
      let count = tree.count();
      tree.delete(42);
      expect(tree.count()).to.equal(count);
    });
    it('should delete the correct node', function () {
      let tree = bbtree.createTree();
      let data = [9, 5, 10, 0, 8, 11, -1, 1, 2, 100, 101, 102, 103, 104, -45, -12, 1000, 99, -99];
      data.forEach((value) => tree.insert(value));
      let size = tree.count();
      data.forEach((value) => {
        tree.delete(value);
        expect(tree.get(value)).to.be.a('null');
        expect(tree.count()).to.equal(--size);
      });
      expect(tree.count()).to.equal(0);
      for (let ix = 0; ix < 42; ix++) {
        tree.insert(ix);
      }
      for (let ix = 41; ix >= 0; ix--) {
        tree.delete(ix);
      }
      expect(tree.count()).to.equal(0);
    });
  });
});
