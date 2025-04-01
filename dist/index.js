"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var path = __toESM(require("path"));
var import_fs = require("fs");
var hmrFilePath = path.resolve(__dirname, "../assets/hmr.js");
var hmrCode = (0, import_fs.readFileSync)(hmrFilePath, "utf8");
function index_default(content) {
  const result = inject(content, hmrCode);
  return result;
}
function inject(originalElmCodeJS, hmrCode2) {
  if (originalElmCodeJS.indexOf("_elm_lang$core$Native_Platform.initialize") >= 0) {
    throw new Error(
      "[elm-hot] Elm 0.18 is not supported. Please use fluxxu/elm-hot-loader@0.5.x instead."
    );
  }
  let modifiedCode = originalElmCodeJS;
  if (originalElmCodeJS.indexOf("elm$browser$Browser$application") !== -1) {
    const navKeyDefinition = /var\s+key\s*=\s*function\s*\(\)\s*{\s*key.a\(\s*onUrlChange\(\s*_Browser_getUrl\(\)\s*\)\s*\);\s*};/;
    modifiedCode = originalElmCodeJS.replace(
      navKeyDefinition,
      replacementString
    );
    if (modifiedCode === originalElmCodeJS) {
      throw new Error(
        "[elm-hot] Browser.Navigation.Key def not found. Version mismatch?"
      );
    }
  }
  const regex = /(_Platform_export\([^]*)(}\(this\)\);)/;
  const match = regex.exec(modifiedCode);
  if (match === null) {
    throw new Error(
      "Compiled JS from the Elm compiler is not valid. You must use the Elm 0.19 compiler."
    );
  }
  return modifiedCode.slice(0, match.index) + match[1] + "\n\n" + hmrCode2 + "\n\n" + match[2];
}
function replacementString(match) {
  return match + "\nkey['elm-hot-nav-key'] = true;";
}
