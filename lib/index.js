"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _jsdom = require("jsdom");

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _generateStubId = _interopRequireDefault(require("./generateStubId"));

var _consts = require("./consts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = _util.default.promisify(_fs.default.readFile);

const writeFile = _util.default.promisify(_fs.default.writeFile);

const POSTFIX = '--env-config';

let getSSIConfig = key => {
  return () => {
    const postfix = '__POSTFIX__';
    const doc = window.document;
    const el = doc.getElementById(key + postfix);
    let conf;

    if (el) {
      try {
        conf = JSON.parse(el.innerText);
      } catch (e) {}
    }

    return conf;
  };
};

function* iterateBundles(bundle) {
  if (bundle.name) {
    yield bundle;
  }

  for (let child of bundle.childBundles) {
    if (child.name.endsWith('.map')) continue;
    yield* iterateBundles(child);
  }
}

function getHeadElementOrCreateOne(document) {
  let htmls = document.getElementsByTagName('html');

  if (!htmls || htmls.length <= 0) {
    throw new Error('For some reason this html document does not have an <html />');
  }

  let html = htmls[0];
  let heads = html.getElementsByTagName('head');

  if (heads && heads.length > 0) {
    return heads[0];
  }

  let head = document.createElement('head');

  if (html.children[0]) {
    html.insertBefore(head, html.children[0]);
  } else {
    html.appendChild(head);
  }

  return head;
}

function appendSSIRootScript(document, element) {
  let script = document.createElement('script');
  let content = document.createTextNode(_consts.GLOBAL_FUNC_GET_SSI_CONFIG + '=' + getSSIConfig.toString().replace('__POSTFIX__', POSTFIX));
  script.appendChild(content);
  element.appendChild(script);
}

function appendSSIInfos(document, element, ssiInfos) {
  let stubs = [];
  let defStubId = (0, _generateStubId.default)();
  let defStubUsed = false;
  ssiInfos.forEach(ssi => {
    if (!ssi.stub) {
      ssi.stubId = defStubId;
      defStubUsed = true;
      return;
    }

    ssi.stubId = (0, _generateStubId.default)();
    stubs.push({
      id: ssi.stubId,
      text: JSON.stringify(ssi.stub)
    });
  });

  if (defStubUsed) {
    stubs.unshift({
      id: defStubId,
      text: ''
    });
  }

  stubs.forEach(stub => {
    let ssiStubCommentStart = document.createComment(`# block name="${stub.id}" `);
    let ssiStubText = document.createTextNode(stub.text);
    let ssiStubCommentEnd = document.createComment(`# endblock `);
    let br = document.createTextNode('\n');
    element.appendChild(ssiStubCommentStart);
    element.appendChild(ssiStubText);
    element.appendChild(ssiStubCommentEnd);
    element.appendChild(br);
  });
  ssiInfos.forEach(ssi => {
    let script = document.createElement('script');
    script.id = ssi.key + POSTFIX;
    script.setAttribute('type', 'application/json');
    let ssiComment = document.createComment(`# include file="/${ssi.file}" stub="${ssi.stubId}" `);
    let br = document.createTextNode('\n');
    script.appendChild(ssiComment);
    element.appendChild(script);
    element.appendChild(br);
  });
}

function _default(bundler) {
  bundler.addAssetType('ssijson', require.resolve('./SSIJSONAsset'));
  bundler.addPackager('ssijson', require.resolve('./SSIJSONPackager'));
  bundler.on('bundled', async mainBundle => {
    if (mainBundle.type !== 'html') {
      return;
    }

    let jsdom = new _jsdom.JSDOM(mainBundle.entryAsset.generated.html);
    let {
      window
    } = jsdom;
    let {
      document
    } = window;
    let head = getHeadElementOrCreateOne(document);
    let ssiBundle;

    for (ssiBundle of iterateBundles(mainBundle)) {
      if (ssiBundle.type === 'ssijson') {
        break;
      }
    }

    if (!ssiBundle) {
      throw new Error('Cannot find ssijson bundle');
    }

    let ssiInfos = JSON.parse((await readFile(ssiBundle.name, {
      encoding: 'utf8'
    })));
    appendSSIRootScript(document, head);
    appendSSIInfos(document, head, ssiInfos);
    await writeFile(mainBundle.name, jsdom.serialize());
  });
}

module.exports = exports.default;