"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const react_feather_1 = require("react-feather");
const rebass_1 = require("rebass");
const styled_components_1 = require("styled-components");
const styleds_1 = require("./styleds");
function TradePrice({ price, showInverted, setShowInverted }) {
    var _a, _b, _c, _d, _e;
    const theme = react_2.useContext(styled_components_1.ThemeContext);
    const formattedPrice = showInverted ? price === null || price === void 0 ? void 0 : price.toSignificant(6) : (_a = price === null || price === void 0 ? void 0 : price.invert()) === null || _a === void 0 ? void 0 : _a.toSignificant(6);
    const show = Boolean((price === null || price === void 0 ? void 0 : price.baseCurrency) && (price === null || price === void 0 ? void 0 : price.quoteCurrency));
    const label = showInverted
        ? `${(_b = price === null || price === void 0 ? void 0 : price.quoteCurrency) === null || _b === void 0 ? void 0 : _b.symbol} per ${(_c = price === null || price === void 0 ? void 0 : price.baseCurrency) === null || _c === void 0 ? void 0 : _c.symbol}`
        : `${(_d = price === null || price === void 0 ? void 0 : price.baseCurrency) === null || _d === void 0 ? void 0 : _d.symbol} per ${(_e = price === null || price === void 0 ? void 0 : price.quoteCurrency) === null || _e === void 0 ? void 0 : _e.symbol}`;
    return (react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 14, color: theme.text2, style: { justifyContent: 'center', alignItems: 'center', display: 'flex' } }, show ? (react_1.default.createElement(react_1.default.Fragment, null, formattedPrice !== null && formattedPrice !== void 0 ? formattedPrice : '-',
        " ",
        label,
        react_1.default.createElement(styleds_1.StyledBalanceMaxMini, { onClick: () => setShowInverted(!showInverted) },
            react_1.default.createElement(react_feather_1.Repeat, { size: 14 })))) : ('-')));
}
exports.default = TradePrice;
