'use strict';

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value || null;
    this.left = null;
    this.right = null;
    this.height = 1;
  }

  toObject() {
    return {
      key: this.key,
      value: this.value
    };
  }
}

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

function insert(node, key, value) {
  if (!node) return new Node(key, value);
  if (key === node.key) return node;
  if (key < node.key) {
    node.left = insert(node.left, key, value);
  }
  else {
    node.right = insert(node.right, key, value);
  }
  node.height = Math.max(height(node.left), height(node.right)) + 1;

  let balance = getBalance(node);
  if (balance > 1 && key < node.left.key) {
    return rightRotate(node);
  }
  if (balance < -1 && key > node.right.key) {
    return leftRotate(node);
  }
  if (balance > 1 && key > node.left.key) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }
  if (balance < -1 && key < node.right.key) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  return node;
}

function deleteNode(root, key) {
  if (!root) return root;

  if (key < root.key) {
    root.left = deleteNode(root.left, key);
  }
  else if (key > root.key) {
    root.right = deleteNode(root.right, key);
  }
  else {
    if ((!root.left) || (!root.right)) {
      let temp = null;
      if (temp === root.left) {
        temp = root.right;
      } else {
        temp = root.left;
      }

      if (!temp) {
        temp = root;
        root = null;
      }
      else {
        root = temp;
      }
    }
    else {
      let temp = minValueNode(root.right);
      root.key = temp.key;
      root.right = deleteNode(root.right, temp.key);
    }
  }

  if (!root) {
    return root;
  }

  root.height = Math.max(height(root.left), height(root.right)) + 1;
  let balance = getBalance(root);
  if (balance > 1 && getBalance(root.left) >= 0) {
    return rightRotate(root);
  }

  if (balance > 1 && getBalance(root.left) < 0) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }

  if (balance < -1 && getBalance(root.right) <= 0) {
    return leftRotate(root);
  }
  if (balance < -1 && getBalance(root.right) > 0) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }

  return root;
}

function get(node, key) {
  if (!node) return null;
  if (key === node.key) return node.toObject();
  if (key < node.key) return get(node.left, key);
  return get(node.right, key);
}

function traverseInOrder(node, cb) {
  if (!node) return;
  traverseInOrder(node.left, cb);
  cb(node.key, node.value);
  traverseInOrder(node.right, cb);
}

function count(node) {
  return node ? count(node.left) + count(node.right) + 1 : 0;
}

function createTree() {

  let root = null;

  return {
    insert: (key, value) => { root = insert(root, key, value); },
    delete: (key) => { root = deleteNode(root, key); },
    traverseInOrder: (cb) => { traverseInOrder(root, cb); },
    get: (key) => { return get(root, key); },
    count: () => { return count(root); }
  };
}

module.exports = {
  createTree: createTree
};
