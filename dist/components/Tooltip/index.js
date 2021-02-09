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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseoverTooltip = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Popover_1 = __importDefault(require("../Popover"));
const TooltipContainer = styled_components_1.default.div `
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`;
function Tooltip(_a) {
    var { text } = _a, rest = __rest(_a, ["text"]);
    return react_1.default.createElement(Popover_1.default, Object.assign({ content: react_1.default.createElement(TooltipContainer, null, text) }, rest));
}
exports.default = Tooltip;
function MouseoverTooltip(_a) {
    var { children } = _a, rest = __rest(_a, ["children"]);
    const [show, setShow] = react_1.useState(false);
    const open = react_1.useCallback(() => setShow(true), [setShow]);
    const close = react_1.useCallback(() => setShow(false), [setShow]);
    return (react_1.default.createElement(Tooltip, Object.assign({}, rest, { show: show }),
        react_1.default.createElement("div", { onMouseEnter: open, onMouseLeave: close }, children)));
}
exports.MouseoverTooltip = MouseoverTooltip;
