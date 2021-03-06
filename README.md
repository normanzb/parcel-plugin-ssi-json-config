# Parcel-plugin-ssi-json-config

This is a Parcel plugin to generate SSI into entry HTML file and retrieve the ssi content as JSON module.

This helps you to easily retrieve JSON configurations from kubernetes config map, as long as you mount it properly as a JSON file.

See more at [Nginx SSI](http://nginx.org/en/docs/http/ngx_http_ssi_module.html)

## Installation

```
npm install parcel-plugin-ssi-json-config -D
```

## Usage

test.ssijson

```JSON
{
  "file": "platformAuthConfig.json", 
  "stub": {
    "fallback": 123
  }
}
```

index.js

```javascript
import ssiJSON from "./test.ssijson"

console.log("ssi json", ssiJSON())
```

Run the build, you will get below snippet into your entry html file:

```
<!--# block name="7eb5f4713d6011eaab3f19e7ca87280a" -->{"fallback":123}<!--# endblock -->
<script type="application/json"><!--# include file="/platformAuthConfig.json" stub="7eb5f4713d6011eaab3f19e7ca87280a" --></script>
```

## SSIJSON

Fields you can use in SSIJSON file

* file: optional, if not provided the module file name will be used, with replaced ".json" extension
* stub: fallback json content to put into ssi block 

## SSI mocking for local development

This plugin can inject local json file contents into the place where the same ssi json file name is expected.

You can do this by setting environment variable `PARCEL_PLUGIN_SSI_JSON_CONFIG_ENABLE_MOCK` to `true`, this will cause the plugin to seek mock json files inside `ssi-mocks` folder under the directory where parcel was executed.

You can also change the folder path by configuring environment variable `PARCEL_PLUGIN_SSI_JSON_CONFIG_MOCK_PATH`

Example:

```
PARCEL_PLUGIN_SSI_JSON_CONFIG_ENABLE_MOCK=true PARCEL_PLUGIN_SSI_JSON_CONFIG_MOCK_PATH=ssimocks parcel index.html
```
