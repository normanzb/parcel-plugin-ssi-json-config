"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parcel = require("parcel");

var _consts = require("./consts");

class SSIJSONAsset extends _parcel.Asset {
  /**
   * @desc Generate asset imported by js bundle
   *
   * @return generated assets for packagers
   */
  async generate() {
    let ssiInfo = JSON.parse(this.contents);
    let ssiKey = this.basename.replace(/\.ssijson$/, '');
    ssiInfo = Object.assign({
      file: ssiKey + ".json",
      key: ssiKey
    }, ssiInfo);
    return [{
      type: 'ssijson',
      value: ssiInfo
    }, {
      type: 'js',
      value: `module.exports = window.${_consts.GLOBAL_FUNC_GET_SSI_CONFIG}(${JSON.stringify(ssiInfo.key)})()`
    }];
  }

}

var _default = SSIJSONAsset;
exports.default = _default;
module.exports = exports.default;