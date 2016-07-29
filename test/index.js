'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const _ = require('lodash');
const bbtree = require('../lib');
const testData = require('./testdata.json').members;
const createTree = bbtree.createTree;
const BbTreeError = bbtree.BbTreeError;
const preOrderedTestData = require('./preOrderedData.json').members;
const inOrderTestData = require('./inOrderData.json').members;
const postOrderedTestData = require('./postOrderedData.json').members;

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
      return expect(populateTree(tree, data)).to.eventually.equal(tree);
    });

    it('should insert values with a custom comparer', function () {
      let tree = createTree(comparer);
      return expect(populateTree(tree, testData)).to.eventually.equal(tree);
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
      return expect(createTree().get(nonExistantKey)).to.be.rejectedWith(bbtree.BbTreeError);
    });

    it('should not return a value for a key that does not exist', function () {
      return populateTree(createTree(comparer), testData)
        .then((tree) => {
          return expect(tree.get(nonExistantKey)).to.be.rejectedWith(bbtree.BbTreeError);
        });
    });

    it('should return the value for a key that does exist', function () {
      let accountToRetrieve = testData[7];
      let key = { accountNumber: accountToRetrieve.accountNumber };
      return populateTree(createTree(comparer), testData)
        .then((tree) => {
          return expect(tree.get(key)).to.eventually.equal(accountToRetrieve);
        });
    });
  });

  describe('#traversePreOrder()', function () {
    it('should traverse the tree in pre order', function () {
      let preOrder = [];
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traversePreOrder((value) => { preOrder.push(value); });
        })
        .then(() => {
          return Promise.resolve(_.isEqual(preOrder, preOrderedTestData));
        });
      return expect(promise).to.eventually.be.true;
    });

    it('should reject if there is an error in the callback', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traversePreOrder(() => { throw new Error('cberror'); });
        })
        .then(() => {
          return Promise.resolve();
        });
      return expect(promise).to.be.rejectedWith(Error, /cberror/);
    });
  });

  describe('#traverseInOrder()', function () {
    it('should traverse the tree in order', function () {
      let inOrder = [];
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traverseInOrder((value) => { inOrder.push(value); });
        })
        .then(() => {
          return Promise.resolve(_.isEqual(inOrder, inOrderTestData));
        });
      return expect(promise).to.eventually.be.true;
    });

    it('should reject if there is an error in the callback', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traverseInOrder(() => { throw new Error('cberror'); });
        })
        .then(() => {
          return Promise.resolve();
        });
      return expect(promise).to.be.rejectedWith(Error, /cberror/);
    });
  });

  describe('#traversePostOrder()', function () {
    it('should traverse the tree in post order', function () {
      let postOrder = [];
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traversePostOrder((value) => { postOrder.push(value); });
        })
        .then(() => {
          return Promise.resolve(_.isEqual(postOrder, postOrderedTestData));
        });
      return expect(promise).to.eventually.be.true;
    });

    it('should reject if there is an error in the callback', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then((tree) => {
          return tree.traversePostOrder(() => { throw new Error('cberror'); });
        })
        .then(() => {
          return Promise.resolve();
        });
      return expect(promise).to.be.rejectedWith(Error, /cberror/);
    });
  });

  describe('#count()', function () {
    it('should return zero for an empty tree', function () {
      return expect(createTree().count()).to.eventually.equal(0);
    });

    it('should return the number of values', function () {
      return populateTree(createTree(comparer), testData)
        .then((tree) => {
          return expect(tree.count()).to.eventually.equal(testData.length);
        });
    });
  });

  describe('#remove()', function () {
    it('should not remove a non existant key', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then(tree => { return tree.remove(nonExistantKey); });
      return expect(promise).to.be.rejectedWith(BbTreeError, /Value not found/);
    });

    it('should remove values with a custom comparer', function () {
      let promise = Promise.resolve()
        .then(() => { return populateTree(createTree(comparer), testData); });

      testData.forEach((member) => {
        let key = { accountNumber: member.accountNumber };
        promise = promise.then(tree => { return tree.remove(key); });
      });
      promise = promise.then(tree => { return tree.count(); });
      return expect(promise).to.eventually.equal(0);
    });

    it('should remove values with the default comparer', function () {
      let promise = Promise.resolve()
        .then(() => { return populateTree(createTree(), [...Array(42).keys()]); });
      for (let ix = 41; ix >= 0; ix--) {
        promise = promise.then(tree => { return tree.remove(ix); });
      }
      promise = promise.then(tree => { return tree.count(); });
      return expect(promise).to.eventually.equal(0);
    });
  });


  describe('#find()', function () {
    it('should return an empty array if no results are found', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then(tree => { return tree.find((member) => { return member.lastName === 'foo'; }); })
        .then(results => { return _.isEqual(results, []); });
      return expect(promise).to.eventually.be.true;
    });
    it('should return the correct results', function () {
      let lastName = 'Simpson';
      let matcher = (member) => { return member.lastName === lastName; };
      let promise = populateTree(createTree(comparer), testData)
        .then(tree => { return tree.find(matcher); })
        .then(results => {
          let ok = true;
          results.forEach((member) => {
            if (member.lastName !== lastName) ok = false;
          });
          return (!ok || results.length !== 3) ? false : true;
        });
      return expect(promise).to.eventually.be.true;
    });
    it('should reject if the matcher throws an error', function () {
      let promise = populateTree(createTree(comparer), testData)
        .then(tree => { return tree.find(() => { throw new Error('thrownerror'); }); })
        .then(results => { return _.isEqual(results, []); });
      return expect(promise).to.be.rejectedWith(Error, 'thrownerror');
    });
  });
});
