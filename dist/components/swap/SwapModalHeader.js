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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const rebass_1 = require("rebass");
const styled_components_1 = require("styled-components");
const actions_1 = require("../../state/swap/actions");
const theme_1 = require("../../theme");
const Button_1 = require("../Button");
const utils_1 = require("../../utils");
const prices_1 = require("../../utils/prices");
const Column_1 = require("../Column");
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const Row_1 = require("../Row");
const styleds_1 = require("./styleds");
function SwapModalHeader({ trade, allowedSlippage, recipient, showAcceptChanges, onAcceptChanges }) {
    var _a, _b;
    const slippageAdjustedAmounts = react_1.useMemo(() => prices_1.computeSlippageAdjustedAmounts(trade, allowedSlippage), [
        trade,
        allowedSlippage
    ]);
    const { priceImpactWithoutFee } = react_1.useMemo(() => prices_1.computeTradePriceBreakdown(trade), [trade]);
    const priceImpactSeverity = prices_1.warningSeverity(priceImpactWithoutFee);
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(Column_1.AutoColumn, { gap: 'md', style: { marginTop: '20px' } },
        react_1.default.createElement(Row_1.RowBetween, { align: "flex-end" },
            react_1.default.createElement(Row_1.RowFixed, { gap: '0px' },
                react_1.default.createElement(CurrencyLogo_1.default, { currency: trade.inputAmount.currency, size: '24px', style: { marginRight: '12px' } }),
                react_1.default.createElement(styleds_1.TruncatedText, { fontSize: 24, fontWeight: 500, color: showAcceptChanges && trade.tradeType === sdk_1.TradeType.EXACT_OUTPUT ? theme.primary1 : '' }, trade.inputAmount.toSignificant(6))),
            react_1.default.createElement(Row_1.RowFixed, { gap: '0px' },
                react_1.default.createElement(rebass_1.Text, { fontSize: 24, fontWeight: 500, style: { marginLeft: '10px' } }, trade.inputAmount.currency.symbol))),
        react_1.default.createElement(Row_1.RowFixed, null,
            react_1.default.createElement(react_feather_1.ArrowDown, { size: "16", color: theme.text2, style: { marginLeft: '4px', minWidth: '16px' } })),
        react_1.default.createElement(Row_1.RowBetween, { align: "flex-end" },
            react_1.default.createElement(Row_1.RowFixed, { gap: '0px' },
                react_1.default.createElement(CurrencyLogo_1.default, { currency: trade.outputAmount.currency, size: '24px', style: { marginRight: '12px' } }),
                react_1.default.createElement(styleds_1.TruncatedText, { fontSize: 24, fontWeight: 500, color: priceImpactSeverity > 2
                        ? theme.red1
                        : showAcceptChanges && trade.tradeType === sdk_1.TradeType.EXACT_INPUT
                            ? theme.primary1
                            : '' }, trade.outputAmount.toSignificant(6))),
            react_1.default.createElement(Row_1.RowFixed, { gap: '0px' },
                react_1.default.createElement(rebass_1.Text, { fontSize: 24, fontWeight: 500, style: { marginLeft: '10px' } }, trade.outputAmount.currency.symbol))),
        showAcceptChanges ? (react_1.default.createElement(styleds_1.SwapShowAcceptChanges, { justify: "flex-start", gap: '0px' },
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(react_feather_1.AlertTriangle, { size: 20, style: { marginRight: '8px', minWidth: 24 } }),
                    react_1.default.createElement(theme_1.TYPE.main, { color: theme.primary1 }, " Price Updated")),
                react_1.default.createElement(Button_1.ButtonPrimary, { style: { padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }, onClick: onAcceptChanges }, "Accept")))) : null,
        react_1.default.createElement(Column_1.AutoColumn, { justify: "flex-start", gap: "sm", style: { padding: '12px 0 0 0px' } }, trade.tradeType === sdk_1.TradeType.EXACT_INPUT ? (react_1.default.createElement(theme_1.TYPE.italic, { textAlign: "left", style: { width: '100%' } },
            `Output is estimated. You will receive at least `,
            react_1.default.createElement("b", null, (_a = slippageAdjustedAmounts[actions_1.Field.OUTPUT]) === null || _a === void 0 ? void 0 :
                _a.toSignificant(6),
                " ",
                trade.outputAmount.currency.symbol),
            ' or the transaction will revert.')) : (react_1.default.createElement(theme_1.TYPE.italic, { textAlign: "left", style: { width: '100%' } },
            `Input is estimated. You will sell at most `,
            react_1.default.createElement("b", null, (_b = slippageAdjustedAmounts[actions_1.Field.INPUT]) === null || _b === void 0 ? void 0 :
                _b.toSignificant(6),
                " ",
                trade.inputAmount.currency.symbol),
            ' or the transaction will revert.'))),
        recipient !== null ? (react_1.default.createElement(Column_1.AutoColumn, { justify: "flex-start", gap: "sm", style: { padding: '12px 0 0 0px' } },
            react_1.default.createElement(theme_1.TYPE.main, null,
                "Output will be sent to",
                ' ',
                react_1.default.createElement("b", { title: recipient }, utils_1.isAddress(recipient) ? utils_1.shortenAddress(recipient) : recipient)))) : null));
}
exports.default = SwapModalHeader;
