'use strict';

function BbTreeError(message) {
  this.name = 'BbTreeError';
  this.message = message || 'An error occurred';
  this.stack = (new Error()).stack;
}
BbTreeError.prototype = Object.create(Error.prototype);
BbTreeError.prototype.constructor = BbTreeError;

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

function createTree(comparer) {

  let root = null;
  let cmp = comparer || ((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  function height(node) {
    return node ? node.height : 0;
  }

  function minValueNode(node) {
    let current = node;

    while (current.left != null) {
      current = current.left;
    }

    return current;
  }

  function rightRotate(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
  }

  function leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
  }

  function getBalance(node) {
    return node ? height(node.left) - height(node.right) : 0;
  }

  /*
    insert functions
  */

  function validateValue(value) {
    if (typeof value === 'undefined' || value === null) {
      return Promise.reject(new BbTreeError('Invalid value'));
    }
    return Promise.resolve(value);
  }

  function insertValue(value) {
    try {
      root = insert(root, value);
      return Promise.resolve(value);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  function insert(node, value) {
    if (!node) return new Node(value);
    let cmpResult = cmp(value, node.value);
    if (cmpResult === 0) throw new BbTreeError('Value already exists');
    if (cmpResult < 0) {
      node.left = insert(node.left, value);
    }
    else {
      node.right = insert(node.right, value);
    }
    node.height = Math.max(height(node.left), height(node.right)) + 1;

    let balance = getBalance(node);
    if (balance > 1 && (cmp(value, node.left.value) < 0)) {
      return rightRotate(node);
    }
    if (balance < -1 && (cmp(value, node.right.value) > 0)) {
      return leftRotate(node);
    }
    if (balance > 1 && (cmp(value, node.left.value) > 0)) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    if (balance < -1 && (cmp(value, node.right.value) < 0)) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  }

  function get(node, value) {
    if (!node) throw new BbTreeError('Value not found');
    let cmpResult = cmp(value, node.value);
    if (cmpResult === 0) return node.value;
    if (cmpResult < 0) return get(node.left, value);
    return get(node.right, value);
  }

  function find(node, matcher) {
    if (!node) return [];

    return matcher(node.value) ?
      find(node.left, matcher).concat([node.value], find(node.right, matcher)) :
      find(node.left, matcher).concat(find(node.right, matcher));
  }

  function removeValue(value) {
    try {
      root = remove(root, value);
      return Promise.resolve(value);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  function remove(node, value) {
    if (!node) throw new BbTreeError('Value not found');

    let cmpResult = cmp(value, node.value);
    if (cmpResult < 0) {
      node.left = remove(node.left, value);
    }
    else if (cmpResult > 0) {
      node.right = remove(node.right, value);
    }
    else {
      if ((!node.left) || (!node.right)) {
        let temp = null;
        if (temp === node.left) {
          temp = node.right;
        } else {
          temp = node.left;
        }

        if (!temp) {
          temp = node;
          node = null;
        }
        else {
          node = temp;
        }
      }
      else {
        let temp = minValueNode(node.right);
        node.value = temp.value;
        node.right = remove(node.right, temp.value);
      }
    }

    if (!node) {
      return node;
    }

    node.height = Math.max(height(node.left), height(node.right)) + 1;
    let balance = getBalance(node);
    if (balance > 1 && getBalance(node.left) >= 0) {
      return rightRotate(node);
    }

    if (balance > 1 && getBalance(node.left) < 0) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    if (balance < -1 && getBalance(node.right) <= 0) {
      return leftRotate(node);
    }
    if (balance < -1 && getBalance(node.right) > 0) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  }

  function traversePreOrder(node, cb) {
    if (!node) return;
    cb(node.value);
    traversePreOrder(node.left, cb);
    traversePreOrder(node.right, cb);
  }

  function traverseInOrder(node, cb) {
    if (!node) return;
    traverseInOrder(node.left, cb);
    cb(node.value);
    traverseInOrder(node.right, cb);
  }

  function traversePostOrder(node, cb) {
    if (!node) return;
    traversePostOrder(node.left, cb);
    traversePostOrder(node.right, cb);
    cb(node.value);
  }

  function count(node) {
    return node ? count(node.left) + count(node.right) + 1 : 0;
  }

  function createInsertFunction(value) {
    return function () {
      return Promise.resolve(value)
        .then(validateValue)
        .then(insertValue)
        .catch((err) => { return Promise.reject({ value: value, error: err }); });
    };
  }

  function insertValues(values) {
    if (!Array.isArray(values)) return Promise.reject(new TypeError('Array expected'));
    let rejectedValues = [];
    let result = Promise.resolve();
    values.forEach(value => {
      result = result
        .then(createInsertFunction(value))
        .catch(rejection => { rejectedValues.push(rejection); });
    });
    return result.then(() => { return Promise.resolve(rejectedValues); });
  }

  function getValue(key) {
    try {
      let value = get(root, key);
      return Promise.resolve(value);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  function handleError(err) {
    return Promise.reject(err);
  }

  function* inOrderValues() {
    function* recurse(node) {
      if (!node) return;
      yield* recurse(node.left);
      yield node.value;
      yield* recurse(node.right);
    }
    yield* recurse(root);
  }

  return {
    insert: function (value) {
      return Promise.resolve(value)
        .then(validateValue)
        .then(insertValue)
        .then(() => { return Promise.resolve(this); })
        .catch(handleError);
    },
    bulkInsert: values => {
      return Promise.resolve(values)
        .then(insertValues)
        .catch(handleError);
    },
    get: key => {
      return Promise.resolve(key)
        .then(getValue)
        .catch(handleError);
    },
    find: (matcher) => {
      return Promise.resolve(matcher)
        .then(matcher => { return find(root, matcher); })
        .catch(handleError);
    },
    remove: function (value) {
      return Promise.resolve(value)
        .then(removeValue)
        .then(() => { return Promise.resolve(this); })
        .catch(handleError);
    },
    traversePreOrder: function (cb) {
      return Promise.resolve(cb)
        .then(callBack => {
          traversePreOrder(root, callBack);
          return Promise.resolve(this);
        })
        .catch(handleError);
    },
    traverseInOrder: function (cb) {
      return Promise.resolve(cb)
        .then(callBack => {
          traverseInOrder(root, callBack);
          return Promise.resolve(this);
        })
        .catch(handleError);
    },
    traversePostOrder: function (cb) {
      return Promise.resolve(cb)
        .then(callBack => {
          traversePostOrder(root, callBack);
          return Promise.resolve(this);
        })
        .catch(handleError);
    },
    count: () => { return Promise.resolve(count(root)); },
    get inOrderValues() { return inOrderValues(); }
  };
}

module.exports = {
  createTree: createTree,
  BbTreeError: BbTreeError
};
