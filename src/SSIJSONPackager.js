const { Packager } = require('parcel');

class SvgPackager extends Packager {
  constructor(bundle, bundler) {
    super(bundle, bundler);
    this.ssiInfos = []
  }

  /**
   * @desc function run by parcel for each asset of a package
   * @param {Asset} asset 
   */
  async addAsset(asset) {
    if (!asset.generated.ssijson) {
      return
    }

    this.ssiInfos.push(asset.generated.ssijson)
  }

  async end() {
    this.dest.end(JSON.stringify(this.ssiInfos))
  }

  getSize() {
    return this.dest.bytesWritten || 0
  }
}

module.exports = SvgPackager;
