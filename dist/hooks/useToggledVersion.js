"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_VERSION = exports.Version = void 0;
const useParsedQueryString_1 = __importDefault(require("./useParsedQueryString"));
var Version;
(function (Version) {
    Version["v1"] = "v1";
    Version["v2"] = "v2";
})(Version = exports.Version || (exports.Version = {}));
exports.DEFAULT_VERSION = Version.v2;
function useToggledVersion() {
    const { use } = useParsedQueryString_1.default();
    if (!use || typeof use !== 'string')
        return Version.v2;
    if (use.toLowerCase() === 'v1')
        return Version.v1;
    return exports.DEFAULT_VERSION;
}
exports.default = useToggledVersion;
