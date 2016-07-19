'use strict';

const expect = require('chai').expect;
const bbtree = require('../lib');
const testData = require('./testdata.json').members;
const preOrderedTestData = require('./preOrderedData.json').members;
const inOrderTestData = require('./inOrderData.json').members;
const postOrderedTestData = require('./postOrderedData.json').members;

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

describe('BbTree', function () {
  it('should export function createTree', function () {
    expect(bbtree).to.respondTo('createTree');
  });
});

describe('Tree', function () {

  let tree = null;
  let emptyTree = bbtree.createTree();
  let nonExistantKey = { accountNumber: 42 };
  let validateTree = () => {
    testData.forEach((member) => {
      let result = tree.get({ accountNumber: member.accountNumber });
      expect(result).to.equal(member);
    });
    expect(tree.count()).to.equal(testData.length);
  };

  beforeEach('Populating tree', function () {
    tree = bbtree.createTree(comparer);
    testData.forEach((member) => { tree.insert(member); });
  });

  describe('#insert()', function () {

    it('should insert values', function () {
      validateTree();
      tree = bbtree.createTree();
      let data = [9, 5, 10, 0, 8, 11, -1, 1, 2, 100, 101, 102, 103, 104, -45, -12, 1000, 99, -99];
      data.forEach((value) => tree.insert(value));
      data.forEach((value) => {
        expect(tree.get(value)).to.equal(value);
      });
    });

    it('should not insert a duplicate value', function () {
      tree.insert(testData[0]);
      expect(tree.count()).to.equal(testData.length);
      validateTree();
    });
  });

  describe('#get()', function () {

    it('should return null for an empty tree', function () {
      expect(emptyTree.get(nonExistantKey)).to.be.a('null');
    });

    it('should return null for a key that does not exist', function () {
      expect(tree.get(nonExistantKey)).to.be.a('null');
    });

    it('should return the value for a key that does exist', function () {
      validateTree();
    });
  });

  describe('#traversePreOrder()', function () {

    it('should traverse the tree in pre order', function () {
      let preOrder = [];
      tree.traversePreOrder((value) => { preOrder.push(value); });
      expect(preOrder).to.deep.equal(preOrderedTestData);
    });
  });

  describe('#traverseInOrder()', function () {

    it('should traverse the tree in order', function () {
      let inOrder = [];
      tree.traverseInOrder((value) => { inOrder.push(value); });
      expect(inOrder).to.deep.equal(inOrderTestData);
    });
  });

  describe('#traversePostOrder()', function () {

    it('should traverse the tree in post order', function () {
      let postOrder = [];
      tree.traversePostOrder((value) => { postOrder.push(value); });
      expect(postOrder).to.deep.equal(postOrderedTestData);
    });
  });

  describe('#count()', function () {

    it('should return zero for an empty tree', function () {
      expect(emptyTree.count()).to.equal(0);
    });

    it('should return the number of nodes', function () {
      expect(tree.count()).to.equal(testData.length);
    });
  });

  describe('#delete()', function () {
    
    it('should not delete a non existant key', function () {
      tree.delete(nonExistantKey);
      expect(tree.count()).to.equal(testData.length);
    });
    
    it('should delete the correct node', function () {
      let size = tree.count();
      testData.forEach((member) => {
        let key = { accountNumber: member.accountNumber };
        tree.delete(key);
        expect(tree.get(key)).to.be.a('null');
        expect(tree.count()).to.equal(--size);
      });
      expect(tree.count()).to.equal(0);

      tree = bbtree.createTree();
      [...Array(42).keys()].forEach(value => { tree.insert(value); });
      size = tree.count();
      for (let ix = 41; ix >= 0; ix--) {
        tree.delete(ix);
        expect(tree.get(ix)).to.be.a('null');
        expect(tree.count()).to.equal(--size);
      }
      expect(tree.count()).to.equal(0);
    });
  });

  describe('#find()', function () {
    it('should return an empty array if no results are found', function () {
      expect(tree.find((member) => { return member.lastName === 'foo'; }).length).to.equal(0);
    });
    it('should return the correct results', function () {
      let lastName = 'Simpson';
      let results = tree.find((member) => { return member.lastName === lastName; });
      expect(results.length).to.equal(3);
      results.forEach((member) => {
        expect(member.lastName).to.equal(lastName);
      });
      lastName = 'Gumble';
      results = tree.find((member) => { return member.lastName === lastName; });
      expect(results.length).to.equal(1);
      results.forEach((member) => {
        expect(member.lastName).to.equal(lastName);
      });
    });
  });

});
