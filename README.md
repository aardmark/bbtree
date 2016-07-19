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

The `createTree([comparer(a, b)])` method instantiates a new tree.  
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
### Methods

#### Insertion

The `insert(value)` method allows for insertion into the tree. Duplicate entries are silently ignored.
```js
let memberAccount = new MemberAccount(42, 'Arthur', 'Dent');

tree.insert(memberAccount);
```

#### Retrieval

The `get(key)` method retrieves the value based on the key provided or null if no match is found.  

```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

let memberAccount = { accountNumber: 42, firstName: 'Arthur', lastName: 'Dent' };
tree.insert(memberAccount);

let key = { accountNumber: 42 };

let account = tree.get(key);
```

The `find(matcher(value))` method returns an array of values that match the matcher function or an empty array if no matches are found.

```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

tree.insert({ accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' });
tree.insert({ accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' });
tree.insert({ accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' });

let lastName = 'Flintstone';
let matcher = (member) => { return member.lastName === lastName; };
let results = tree.find(matcher); // returns Fred and Wilma

lastName = 'Rubble';
results = tree.find(matcher); // returns Barney
```

The `count()` method returns the number of values contained in the tree.

```js
let numberOfValues = tree.count();
```
#### Removal

The `remove(key)` method removes the value from the tree.

```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

let memberAccount = { accountNumber: 42, firstName: 'Arthur', lastName: 'Dent' };
tree.insert(memberAccount);

let key = { accountNumber: 42 };

tree.remove(key);
```
#### Traversal

The `traversePreOrder(callback(value))`, `traverseInOrder(callback(value))` and `traversePostOrder(callback(value))` methods allow for traversal of the tree.  
Each one takes a callback function that is called with the value of each node as the tree is traversed. 
```js
let bbtree = require('bbtree');

let comparer = (a, b) => {
  return a.accountNumber - b.accountNumber;
};

let tree = bbtree.createTree(comparer);

tree.insert({ accountNumber: 1, firstName: 'Fred', lastName: 'Flintstone' });
tree.insert({ accountNumber: 2, firstName: 'Wilma', lastName: 'Flintstone' });
tree.insert({ accountNumber: 3, firstName: 'Barney', lastName: 'Rubble' });

let inOrder = [];
tree.traverseInOrder((value) => { inOrder.push(value); });
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
