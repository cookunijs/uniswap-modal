"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const constants_1 = require("../../constants");
const hooks_1 = require("../../hooks");
function Blocklist({ children }) {
    const { account } = hooks_1.useActiveWeb3React();
    const blocked = react_1.useMemo(() => Boolean(account && constants_1.BLOCKED_ADDRESSES.indexOf(account) !== -1), [account]);
    if (blocked) {
        return react_1.default.createElement("div", null, "Blocked address");
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.default = Blocklist;
