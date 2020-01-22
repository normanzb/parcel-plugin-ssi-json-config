"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v1"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => {
  let id = (0, _v.default)();
  return id = id.replace(/-/g, '');
};

exports.default = _default;
module.exports = exports.default;