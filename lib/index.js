'use strict';

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

  function insert(node, value) {
    if (!node) return new Node(value);
    let cmpResult = cmp(value, node.value);
    if (cmpResult === 0) return node;
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
    if (!node) return null;
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

  function remove(node, value) {
    if (!node) return node;

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

  return {
    insert: (value) => { root = insert(root, value); },
    get: (value) => { return get(root, value); },
    find: (matcher) => { return find(root, matcher); },
    remove: (value) => { root = remove(root, value); },
    traversePreOrder: (cb) => { traversePreOrder(root, cb); },
    traverseInOrder: (cb) => { traverseInOrder(root, cb); },
    traversePostOrder: (cb) => { traversePostOrder(root, cb); },
    count: () => { return count(root); }
  };
}

module.exports = {
  createTree: createTree
};
