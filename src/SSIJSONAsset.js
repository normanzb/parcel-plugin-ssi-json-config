import { Asset } from 'parcel'
import { GLOBAL_FUNC_GET_SSI_CONFIG } from './consts'

class SSIJSONAsset extends Asset {
  /**
   * @desc Generate asset of an svg file imported by js bundle
   *
   * @return generated assets for packagers
   */
  async generate() {
    let ssiInfo = JSON.parse(this.contents)
    let ssiKey = this.basename.replace(/\.ssijson$/, '')

    ssiInfo = Object.assign({
      file: ssiKey + ".json",
      key: ssiKey
    }, ssiInfo)

    return [{
      type: 'ssijson',
      value: ssiInfo
    }, {
      type: 'js',
      value: `module.exports = window.${GLOBAL_FUNC_GET_SSI_CONFIG}(${JSON.stringify(ssiInfo.key)})()`,
    }]
  }
}

export default SSIJSONAsset
