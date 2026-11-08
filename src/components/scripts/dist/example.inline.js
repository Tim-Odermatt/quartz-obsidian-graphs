// ============================================================================
// Example Inline Script for Quartz Community Plugin
// ============================================================================
// This file demonstrates patterns commonly used in Quartz plugin client-side code.
// It is bundled as a string and injected via Component.afterDOMLoaded.
//
// Key patterns demonstrated:
// 1. Listening to Quartz navigation events ('nav', 'prenav', 'render')
// 2. Fetching content index data
// 3. DOM manipulation with cleanup
// 4. State persistence (localStorage/sessionStorage)
// 5. Keyboard shortcut handling
// 6. Proper event listener cleanup
// ============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Helper: Remove all children from an element
function _removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// Helper: Simplify slug by removing trailing /index
function _simplifySlug(slug) {
    if (slug.endsWith("/index")) {
        return slug.slice(0, -6);
    }
    return slug;
}
// Helper: Get current page slug from URL
function getCurrentSlug() {
    var slug = window.location.pathname;
    if (slug.startsWith("/"))
        slug = slug.slice(1);
    if (slug.endsWith("/"))
        slug = slug.slice(0, -1);
    return slug || "index";
}
// Helper: Fetch content index (commonly needed for search, graph, explorer)
function _fetchContentIndex() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchData];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _a.sent();
                    console.error("[Plugin] Error fetching content index:", error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Main initialization function
function init() {
    var components = document.querySelectorAll(".example-component");
    if (components.length === 0)
        return;
    // Example: Track cleanup functions for event listeners
    var cleanupFns = [];
    // Example: Add a keyboard shortcut (Ctrl/Cmd + Shift + E)
    function keyboardHandler(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
            e.preventDefault();
            console.log("[ExampleComponent] Keyboard shortcut triggered!");
            // Do something interesting here
        }
    }
    document.addEventListener("keydown", keyboardHandler);
    cleanupFns.push(function () { return document.removeEventListener("keydown", keyboardHandler); });
    var _loop_1 = function (component) {
        var clickHandler = function () {
            console.log("[ExampleComponent] Clicked!");
        };
        component.addEventListener("click", clickHandler);
        cleanupFns.push(function () { return component.removeEventListener("click", clickHandler); });
    };
    // Example: Click handler with proper cleanup
    for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
        var component = components_1[_i];
        _loop_1(component);
    }
    // Register cleanup with Quartz's cleanup system
    if (typeof window !== "undefined" && window.addCleanup) {
        window.addCleanup(function () {
            cleanupFns.forEach(function (fn) { return fn(); });
        });
    }
    console.log("[ExampleComponent] Initialized with", components.length, "component(s)");
}
// Listen to Quartz navigation events
// 'nav' fires after page navigation (including initial load)
// 'render' fires when DOM content changes in-place (e.g. after decryption, dynamic content)
document.addEventListener("nav", function (e) {
    var _a;
    var slug = ((_a = e.detail) === null || _a === void 0 ? void 0 : _a.url) || getCurrentSlug();
    console.log("[ExampleComponent] Navigation to:", slug);
    init();
});
// 'render' fires when DOM content changes in-place and components need re-initialization
document.addEventListener("render", function () {
    console.log("[ExampleComponent] Render event - re-initializing");
    init();
});
// 'prenav' fires before navigation - use for saving state
document.addEventListener("prenav", function () {
    var _a;
    // Example: Save scroll position before navigation
    var component = document.querySelector(".example-component");
    if (component) {
        sessionStorage.setItem("exampleScrollTop", ((_a = component.scrollTop) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
    }
});
