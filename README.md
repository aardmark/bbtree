# bbtree [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]
## Description

A JavaScript implementation of a self balancing binary search (AVL) tree.

---
## Installation

```sh
$ npm install --save bbtree
```
---
## Usage

### Instantiation

The `bbtree.createTree([comparer(a, b)])` method instantiates a new tree.  
The tree will be ordered based on the comparer function.  
If provided, the comparer **_must_** return:
+ a negative number if `a` is less than `b`
+ a positive number if `a` is greater than `b`
+ zero if `a` and `b` are equal

```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

let tree = bbtree.createTree();
```

If no comparer is provided then the following is used to determine order:

```js
(a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}
```
### API

#### bulkInsert(values)
Inserts multiple values into the tree.  
`values`: an array of values to insert.  
Returns a promise that resolves to an array of objects containing the value and error that were **_not_** inserted or an empty array if all values were inserted.  
```js
let bbtree = require('bbtree');
let tree = bbtree.createTree();

tree.bulkInsert([1, 2, 3, 4, 5])
  .then(rejected => {
    // rejected is an empty array
  })
  .catch(err => {
    // do something with the error
  });

tree = bbtree.createTree();
tree.bulkInsert([5, 6, 6, null, 7])
  .then(rejected => {
    // rejected is an array that contains
    // [{value: 6, error: BbTreeError}, {value: null, error: BbTreeError}]
    // as 5 is already in the tree and null is an invalid value.
  })
  .catch(err => {
    // do something with the error
  });

```
#### count()
Returns a promise that resolves to the number of values contained in the tree.
```js
tree.count()
  .then(numberOfValues => {
    // do something with numberOfValues
  });
```
#### find(matcher(value))
Finds zero or more values.  
`matcher`: a function that accepts a value and returns `true` or `false` to indicate whether the value is included in the results.  
Returns a promise that resolves to an array of values that match the matcher function or an empty array if no matches are found.
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

tree.insert({ accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' })
  .then(tree => { return tree.insert({ accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' })})
  .then(tree => { return tree.insert({ accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' })})
  .then(tree => {
    let lastName = 'Flintstone';
    let matcher = (member) => { return member.lastName === lastName; };
    return tree.find(matcher); // returns Fred and Wilma
  })
  .then(results => {
    // results is [ { accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' },
    //              { accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' } ]
  });
```
#### get(key)
Retrieves a value from the tree.  
`key`: the key used to match the value.  
Returns a promise that resolves to the value found or rejects if no match is found. Only the first value found is returned.
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

let memberAccount = { accountNumber: 42, firstName: 'Arthur', lastName: 'Dent' };
tree.insert(memberAccount)
  .then(tree => {
    let key = { accountNumber: 42 };
    return tree.get(key);
  })
  .then(value => {
    // value is { accountNumber: 42, firstName: 'Arthur', lastName: 'Dent' }
  })
  .catch(err => {
    // no match found
  });;
```
#### inOrderValues
Gets an iterator for all the values in the tree in sorted order.
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

tree.insert({ accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' })
  .then(tree => { return tree.insert({ accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' })})
  .then(tree => { return tree.insert({ accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' })})
  .then(tree => {
    let ret = [];
    let sortedValues = tree.inOrderValues;
    for (let value of sortedValues) {
      ret.push(value);
    }
    return ret;
  })
  .then(results => {
    // results is [ { accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' },
    //              { accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' },
    //              { accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' } ]
  })
  .catch(err => {
    // handle the error
  });
```
#### insert(value)
Inserts a value into the tree.  
`value`: the value to insert.  
Returns a promise that resolves to the tree if the insert is successful or rejects if the value is invalid or already contained in the tree.
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);
let memberAccount = new MemberAccount(42, 'Arthur', 'Dent');

tree.insert(memberAccount)
  .then(tree => {
    // do something with the tree
  })
  .catch(err => {
    // insert was not successful
  });
```
#### remove(key)
Removes a value from the tree.  
`key`: the key used to determine which value to remove.  
Returns a promise that resolves to the tree if the removal is successful or rejects if the key is not found.
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

let memberAccount = { accountNumber: 42, firstName: 'Arthur', lastName: 'Dent' };
tree.insert(memberAccount)
  .then(tree => {
    let key = { accountNumber: 42 };
    return tree.remove(key);
  })
  .then(tree => {
    // removal was successful
  })
  .catch(err => {
    // not found or some other error
  });
```
#### traversePreOrder(callback(value))
#### traverseInOrder(callback(value))
#### traversePostOrder(callback(value))
Traverses the tree in order calling the callback function with the value of the node.  
`callback`: the callback that is called for each node.  
Each one takes a callback function that is called with the value of each node as the tree is traversed. 
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);
let firstNames = [];
tree.insert({ accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' })
  .then(tree => { return tree.insert({ accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' }) })
  .then(tree => { return tree.insert({ accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' }) })
  .then(tree => {
    return tree.traverseInOrder(account => { firstNames.push(account.firstName); });
  })
  .then(() => {
    // firstNames is [ 'Fred', 'Wilma', 'Barney' ]
  })
  .catch(err => {
    // handle the error
  });
```
## License

Apache-2.0 © [Mark Smith]()


[npm-image]: https://badge.fury.io/js/bbtree.svg
[npm-url]: https://npmjs.org/package/bbtree
[travis-image]: https://travis-ci.org/aardmark/bbtree.svg?branch=master
[travis-url]: https://travis-ci.org/aardmark/bbtree
[daviddm-image]: https://david-dm.org/aardmark/bbtree.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/aardmark/bbtree
[coveralls-image]: https://coveralls.io/repos/github/aardmark/bbtree/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/aardmark/bbtree?branch=master
