# bbtree [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]
> Balanced Binary Tree

## Installation

```sh
$ npm install --save bbtree
```

## Usage

```js
let bbtree = require('bbtree');

let tree = bbtree.createTree();

tree.insert(key, [value]);
tree.delete(key);
tree.get(key);
tree.traverseInOrder(callback(key, value));
tree.count();
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
