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
const react_feather_1 = require("react-feather");
const rebass_1 = require("rebass");
const styled_components_1 = require("styled-components");
const theme_1 = require("../../theme");
const wrappedCurrency_1 = require("utils/wrappedCurrency");
exports.default = react_1.memo(function SwapRoute({ trade }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(rebass_1.Flex, { flexWrap: "wrap", width: "100%", justifyContent: "flex-end", alignItems: "center" }, trade.route.path.map((token, i, path) => {
        const isLastItem = i === path.length - 1;
        const currency = wrappedCurrency_1.unwrappedToken(token);
        return (react_1.default.createElement(react_1.Fragment, { key: i },
            react_1.default.createElement(rebass_1.Flex, { alignItems: "end" },
                react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, color: theme.text1, ml: "0.125rem", mr: "0.125rem" }, currency.symbol)),
            isLastItem ? null : react_1.default.createElement(react_feather_1.ChevronRight, { size: 12, color: theme.text2 })));
    })));
});
