'use strict';

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value || null;
    this.left = null;
    this.right = null;
    this.depth = 1;
  }
}

function height(node) {
  return node ? node.height : 0;
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

function createTree() {

  let root = null;

  return {
    insert: (key, value) => { root = insert(root, key, value); },
    get root() { return root; }
  };
}

module.exports = {
  createTree: createTree
};
