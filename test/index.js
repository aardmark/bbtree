'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const bbtree = require('../lib');
const testData = require('./testdata.json').members;
const createTree = bbtree.createTree;
const BbTreeError = bbtree.BbTreeError;
// const preOrderedTestData = require('./preOrderedData.json').members;
// const inOrderTestData = require('./inOrderData.json').members;
// const postOrderedTestData = require('./postOrderedData.json').members;

//let C = console;
//C = { log: () => { return; } };

chai.use(chaiAsPromised);
const expect = chai.expect;

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

describe('BbTree', function () {
  it('should export function createTree', function () {
    expect(bbtree).to.respondTo('createTree');
  });

  it('createTree() creates new tree instances', function () {
    expect(createTree()).to.not.equal(createTree());
  });
});

describe('Tree', function () {
  const nonExistantKey = { accountNumber: 42 };

  let populateTree = (tree, data) => {
    let result = Promise.resolve();
    data.map((value) => { return function () { return tree.insert(value); }; })
      .forEach((promiseFactory) => { result = result.then(promiseFactory); });
    return result;
  };

  describe('#insert()', function () {
    it('should resolve to the same tree', function () {
      let tree = createTree();
      expect(tree.insert(1)).to.eventually.equal(tree);
    });

    it('should resolve to the correct tree', function () {
      let allPromise = Promise.all([createTree().insert(1), createTree().insert(1)])
        .then((results) => { return results[0] !== results[1]; });
      return expect(allPromise).to.eventually.equal(true);
    });

    it('should insert values with the default comparer', function () {
      let tree = createTree();
      let data = [9, 5, 10, 0, 8, 11, -1, 1, 2, 100, 101, 102, 103, 104, -45, -12, 1000, 99, -99];
      return expect(populateTree(tree, data)).to.become(tree);
    });

    it('should insert values with a custom comparer', function () {
      let tree = createTree(comparer);
      return expect(populateTree(tree, testData)).to.become(tree);
    });

    it('should not insert null', function () {
      let tree = createTree();
      return expect(tree.insert(null)).to.be.rejectedWith(BbTreeError, /Invalid value/);
    });

    it('should not insert an undefined value', function () {
      let tree = createTree();
      return expect(tree.insert()).to.be.rejectedWith(BbTreeError, /Invalid value/);
    });

    it('should not insert a duplicate value', function () {
      let tree = createTree(comparer);
      return populateTree(tree, testData)
        .then(tree => {
          return expect(tree.insert(testData[5])).to.be.rejectedWith(BbTreeError, /Value already exists/);
        });
    });
  });

  describe('#bulkInsert()', function () {
    it('should insert values with the default comparer', function () {
      let tree = createTree();
      let data = [9, 5, 10, 0, 8, 11, -1, 1, 2, 100, 101, 102, 103, 104, -45, -12, 1000, 99, -99];
      return expect(tree.bulkInsert(data)).to.become([]);
    });

    it('should insert values with a custom comparer', function () {
      let tree = createTree(comparer);
      return expect(tree.bulkInsert(testData)).to.become([]);
    });

    it('should not accept a non-array', function () {
      let tree = createTree();
      return expect(tree.bulkInsert('x')).to.be.rejectedWith(TypeError, /Array expected/);
    });

    it('should not insert duplicate or invalid values', function () {
      let tree = createTree();
      let invalidData = [0, 1, 2, null, 3, 3, undefined, 4, 5];
      let validData = [0, 1, 2, 3, 4, 5];
      let rejectedValues = [null, 3, undefined];
      let countPromise = tree.bulkInsert(invalidData).then(() => { return tree.count(); });
      let insertPromise = createTree().bulkInsert(invalidData);
      return Promise.all([
        expect(countPromise).to.eventually.equal(validData.length),
        expect(insertPromise
          .then(rejectedValues => { return rejectedValues.map(rejectedValue => { return rejectedValue.value; }); }))
          .to.become(rejectedValues)
      ]);
    });
  });

  describe('#get()', function () {

    it('should not return a value for an empty tree', function () {
      let tree = createTree();
      return expect(tree.get(nonExistantKey)).to.be.rejectedWith(bbtree.BbTreeError);
    });

    it('should not return a value for a key that does not exist', function () {
      let tree = createTree(comparer);
      return populateTree(tree, testData)
        .then(() => {
          return expect(tree.get(nonExistantKey)).to.be.rejectedWith(bbtree.BbTreeError);
        });
    });

    it('should return the value for a key that does exist', function () {
      let tree = createTree(comparer);
      let accountToRetrieve = testData[7];
      let key = { accountNumber: accountToRetrieve.accountNumber };
      return populateTree(tree, testData)
        .then(() => {
          return expect(tree.get(key)).to.become(accountToRetrieve);
        });
    });
  });
  /*
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
  */
  describe('#count()', function () {

    it('should return zero for an empty tree', function () {
      return expect(createTree().count()).to.eventually.equal(0);
    });

    it('should return the number of values', function () {
      let tree = createTree(comparer);
      return populateTree(tree, testData)
        .then(() => {
          return expect(tree.count()).to.eventually.equal(testData.length);
        });
    });
  });
  /*
    describe('#remove()', function () {
  
      it('should not remove a non existant key', function () {
        tree.remove(nonExistantKey);
        expect(tree.count()).to.equal(testData.length);
      });
  
      it('should remove the correct node', function () {
        let size = tree.count();
        testData.forEach((member) => {
          let key = { accountNumber: member.accountNumber };
          tree.remove(key);
          expect(tree.get(key)).to.be.a('null');
          expect(tree.count()).to.equal(--size);
        });
        expect(tree.count()).to.equal(0);
  
        tree = createTree();
        [...Array(42).keys()].forEach(value => { tree.insert(value); });
        size = tree.count();
        for (let ix = 41; ix >= 0; ix--) {
          tree.remove(ix);
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
        let matcher = (member) => { return member.lastName === lastName; };
        let results = tree.find(matcher);
        expect(results.length).to.equal(3);
        results.forEach((member) => {
          expect(member.lastName).to.equal(lastName);
        });
        lastName = 'Gumble';
        results = tree.find(matcher);
        expect(results.length).to.equal(1);
        results.forEach((member) => {
          expect(member.lastName).to.equal(lastName);
        });
      });
    });
  */
});
