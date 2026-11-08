"use strict";
exports.__esModule = true;
var lang_1 = require("../util/lang");
var example_scss_1 = require("./styles/example.scss");
// @ts-expect-error - inline script import handled by Quartz bundler
var example_inline_ts_1 = require("./scripts/example.inline.ts");
exports["default"] = (function (opts) {
    var _a = opts !== null && opts !== void 0 ? opts : {}, _b = _a.prefix, prefix = _b === void 0 ? "" : _b, _c = _a.suffix, suffix = _c === void 0 ? "" : _c, _d = _a.className, className = _d === void 0 ? "example-component" : _d;
    var Component = function (props) {
        var _a, _b;
        var frontmatter = (_a = props.fileData) === null || _a === void 0 ? void 0 : _a.frontmatter;
        var title = (_b = frontmatter === null || frontmatter === void 0 ? void 0 : frontmatter.title) !== null && _b !== void 0 ? _b : "Untitled";
        var fullText = "" + prefix + title + suffix;
        return React.createElement("div", { "class": lang_1.classNames(className) }, fullText);
    };
    Component.css = example_scss_1["default"];
    Component.afterDOMLoaded = example_inline_ts_1["default"];
    return Component;
});
satisfies;
QuartzComponentConstructor;
