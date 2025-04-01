// From: https://github.com/klazuka/elm-hot/blob/master/src/inject.js

import * as path from "path";
import { readFileSync } from "fs";

const hmrFilePath = path.resolve(__dirname, "../assets/hmr.js");
const hmrCode = readFileSync(hmrFilePath, "utf8");

export default function (content: string) {
  const result = inject(content, hmrCode);
  return result;
}

// Inject the HMR code into the Elm compiler's JS output
function inject(originalElmCodeJS: string, hmrCode: string): string {
  // Verify that this is not Elm 0.18 code
  if (
    originalElmCodeJS.indexOf("_elm_lang$core$Native_Platform.initialize") >= 0
  ) {
    throw new Error(
      "[elm-hot] Elm 0.18 is not supported. Please use fluxxu/elm-hot-loader@0.5.x instead."
    );
  }

  let modifiedCode = originalElmCodeJS;

  // Handle Browser.Navigation.Key tagging
  if (originalElmCodeJS.indexOf("elm$browser$Browser$application") !== -1) {
    // attach a tag to Browser.Navigation.Key values. It's not really fair to call this a hack
    // as this entire project is a hack, but this is evil evil evil. We need to be able to find
    // the Browser.Navigation.Key in a user's model so that we do not swap out the new one for
    // the old. But as currently implemented (2018-08-19), there's no good way to detect it.
    // So we will add a property to the key immediately after it's created so that we can find it.
    const navKeyDefinition =
      /var\s+key\s*=\s*function\s*\(\)\s*{\s*key.a\(\s*onUrlChange\(\s*_Browser_getUrl\(\)\s*\)\s*\);\s*};/;

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

  // Splice in the HMR code
  const regex = /(_Platform_export\([^]*)(}\(this\)\);)/;
  const match = regex.exec(modifiedCode);

  if (match === null) {
    throw new Error(
      "Compiled JS from the Elm compiler is not valid. You must use the Elm 0.19 compiler."
    );
  }

  return (
    modifiedCode.slice(0, match.index) +
    match[1] +
    "\n\n" +
    hmrCode +
    "\n\n" +
    match[2]
  );
}

function replacementString(match: string) {
  return match + "\n" + "key['elm-hot-nav-key'] = true;";
}
