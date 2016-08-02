'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BbTreeError(message) {
  this.name = 'BbTreeError';
  this.message = message || 'An error occurred';
  this.stack = new Error().stack;
}
BbTreeError.prototype = (0, _create2.default)(Error.prototype);
BbTreeError.prototype.constructor = BbTreeError;

var Node = function Node(value) {
  (0, _classCallCheck3.default)(this, Node);

  this.value = value;
  this.left = null;
  this.right = null;
  this.height = 1;
};

function createTree(comparer) {
  var _marked2 = [inOrderValues].map(_regenerator2.default.mark);

  var root = null;
  var cmp = comparer || function (a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  function height(node) {
    return node ? node.height : 0;
  }

  function minValueNode(node) {
    var current = node;

    while (current.left != null) {
      current = current.left;
    }

    return current;
  }

  function rightRotate(y) {
    var x = y.left;
    var T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
  }

  function leftRotate(x) {
    var y = x.right;
    var T2 = y.left;

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
      return _promise2.default.reject(new BbTreeError('Invalid value'));
    }
    return _promise2.default.resolve(value);
  }

  function insertValue(value) {
    try {
      root = insert(root, value);
      return _promise2.default.resolve(value);
    } catch (err) {
      return _promise2.default.reject(err);
    }
  }

  function insert(node, value) {
    if (!node) return new Node(value);
    var cmpResult = cmp(value, node.value);
    if (cmpResult === 0) throw new BbTreeError('Value already exists');
    if (cmpResult < 0) {
      node.left = insert(node.left, value);
    } else {
      node.right = insert(node.right, value);
    }
    node.height = Math.max(height(node.left), height(node.right)) + 1;

    var balance = getBalance(node);
    if (balance > 1 && cmp(value, node.left.value) < 0) {
      return rightRotate(node);
    }
    if (balance < -1 && cmp(value, node.right.value) > 0) {
      return leftRotate(node);
    }
    if (balance > 1 && cmp(value, node.left.value) > 0) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    if (balance < -1 && cmp(value, node.right.value) < 0) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  }

  function get(node, value) {
    if (!node) throw new BbTreeError('Value not found');
    var cmpResult = cmp(value, node.value);
    if (cmpResult === 0) return node.value;
    if (cmpResult < 0) return get(node.left, value);
    return get(node.right, value);
  }

  function _find(node, matcher) {
    if (!node) return [];

    return matcher(node.value) ? _find(node.left, matcher).concat([node.value], _find(node.right, matcher)) : _find(node.left, matcher).concat(_find(node.right, matcher));
  }

  function removeValue(value) {
    try {
      root = remove(root, value);
      return _promise2.default.resolve(value);
    } catch (err) {
      return _promise2.default.reject(err);
    }
  }

  function remove(node, value) {
    if (!node) throw new BbTreeError('Value not found');

    var cmpResult = cmp(value, node.value);
    if (cmpResult < 0) {
      node.left = remove(node.left, value);
    } else if (cmpResult > 0) {
      node.right = remove(node.right, value);
    } else {
      if (!node.left || !node.right) {
        var temp = null;
        if (temp === node.left) {
          temp = node.right;
        } else {
          temp = node.left;
        }

        if (!temp) {
          temp = node;
          node = null;
        } else {
          node = temp;
        }
      } else {
        var _temp = minValueNode(node.right);
        node.value = _temp.value;
        node.right = remove(node.right, _temp.value);
      }
    }

    if (!node) {
      return node;
    }

    node.height = Math.max(height(node.left), height(node.right)) + 1;
    var balance = getBalance(node);
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

  function _traversePreOrder(node, cb) {
    if (!node) return;
    cb(node.value);
    _traversePreOrder(node.left, cb);
    _traversePreOrder(node.right, cb);
  }

  function _traverseInOrder(node, cb) {
    if (!node) return;
    _traverseInOrder(node.left, cb);
    cb(node.value);
    _traverseInOrder(node.right, cb);
  }

  function _traversePostOrder(node, cb) {
    if (!node) return;
    _traversePostOrder(node.left, cb);
    _traversePostOrder(node.right, cb);
    cb(node.value);
  }

  function _count(node) {
    return node ? _count(node.left) + _count(node.right) + 1 : 0;
  }

  function createInsertFunction(value) {
    return function () {
      return _promise2.default.resolve(value).then(validateValue).then(insertValue).catch(function (err) {
        return _promise2.default.reject({ value: value, error: err });
      });
    };
  }

  function insertValues(values) {
    if (!Array.isArray(values)) return _promise2.default.reject(new TypeError('Array expected'));
    var rejectedValues = [];
    var result = _promise2.default.resolve();
    values.forEach(function (value) {
      result = result.then(createInsertFunction(value)).catch(function (rejection) {
        rejectedValues.push(rejection);
      });
    });
    return result.then(function () {
      return _promise2.default.resolve(rejectedValues);
    });
  }

  function getValue(key) {
    try {
      var value = get(root, key);
      return _promise2.default.resolve(value);
    } catch (err) {
      return _promise2.default.reject(err);
    }
  }

  function handleError(err) {
    return _promise2.default.reject(err);
  }

  function inOrderValues() {
    var _marked, recurse;

    return _regenerator2.default.wrap(function inOrderValues$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            recurse = function recurse(node) {
              return _regenerator2.default.wrap(function recurse$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (node) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt('return');

                    case 2:
                      return _context.delegateYield(recurse(node.left), 't0', 3);

                    case 3:
                      _context.next = 5;
                      return node.value;

                    case 5:
                      return _context.delegateYield(recurse(node.right), 't1', 6);

                    case 6:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _marked[0], this);
            };

            _marked = [recurse].map(_regenerator2.default.mark);
            return _context2.delegateYield(recurse(root), 't0', 3);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _marked2[0], this);
  }

  return {
    insert: function insert(value) {
      var _this = this;

      return _promise2.default.resolve(value).then(validateValue).then(insertValue).then(function () {
        return _promise2.default.resolve(_this);
      }).catch(handleError);
    },
    bulkInsert: function bulkInsert(values) {
      return _promise2.default.resolve(values).then(insertValues).catch(handleError);
    },
    get: function get(key) {
      return _promise2.default.resolve(key).then(getValue).catch(handleError);
    },
    find: function find(matcher) {
      return _promise2.default.resolve(matcher).then(function (matcher) {
        return _find(root, matcher);
      }).catch(handleError);
    },
    remove: function remove(value) {
      var _this2 = this;

      return _promise2.default.resolve(value).then(removeValue).then(function () {
        return _promise2.default.resolve(_this2);
      }).catch(handleError);
    },
    traversePreOrder: function traversePreOrder(cb) {
      var _this3 = this;

      return _promise2.default.resolve(cb).then(function (callBack) {
        _traversePreOrder(root, callBack);
        return _promise2.default.resolve(_this3);
      }).catch(handleError);
    },
    traverseInOrder: function traverseInOrder(cb) {
      var _this4 = this;

      return _promise2.default.resolve(cb).then(function (callBack) {
        _traverseInOrder(root, callBack);
        return _promise2.default.resolve(_this4);
      }).catch(handleError);
    },
    traversePostOrder: function traversePostOrder(cb) {
      var _this5 = this;

      return _promise2.default.resolve(cb).then(function (callBack) {
        _traversePostOrder(root, callBack);
        return _promise2.default.resolve(_this5);
      }).catch(handleError);
    },
    count: function count() {
      return _promise2.default.resolve(_count(root));
    },
    get inOrderValues() {
      return inOrderValues();
    }
  };
}

module.exports = {
  createTree: createTree,
  BbTreeError: BbTreeError
};