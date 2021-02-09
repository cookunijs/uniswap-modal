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
const prices_1 = require("../../utils/prices");
const Button_1 = require("../Button");
const Column_1 = require("../Column");
const QuestionHelper_1 = __importDefault(require("../QuestionHelper"));
const Row_1 = require("../Row");
const FormattedPriceImpact_1 = __importDefault(require("./FormattedPriceImpact"));
const styleds_1 = require("./styleds");
function SwapModalFooter({ trade, onConfirm, allowedSlippage, swapErrorMessage, disabledConfirm }) {
    var _a, _b, _c, _d;
    const [showInverted, setShowInverted] = react_1.useState(false);
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const slippageAdjustedAmounts = react_1.useMemo(() => prices_1.computeSlippageAdjustedAmounts(trade, allowedSlippage), [
        allowedSlippage,
        trade
    ]);
    const { priceImpactWithoutFee, realizedLPFee } = react_1.useMemo(() => prices_1.computeTradePriceBreakdown(trade), [trade]);
    const severity = prices_1.warningSeverity(priceImpactWithoutFee);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Column_1.AutoColumn, { gap: "0px" },
            react_1.default.createElement(Row_1.RowBetween, { align: "center" },
                react_1.default.createElement(rebass_1.Text, { fontWeight: 400, fontSize: 14, color: theme.text2 }, "Price"),
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 14, color: theme.text1, style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        textAlign: 'right',
                        paddingLeft: '10px'
                    } },
                    prices_1.formatExecutionPrice(trade, showInverted),
                    react_1.default.createElement(styleds_1.StyledBalanceMaxMini, { onClick: () => setShowInverted(!showInverted) },
                        react_1.default.createElement(react_feather_1.Repeat, { size: 14 })))),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, trade.tradeType === sdk_1.TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." })),
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14 }, trade.tradeType === sdk_1.TradeType.EXACT_INPUT
                        ? (_b = (_a = slippageAdjustedAmounts[actions_1.Field.OUTPUT]) === null || _a === void 0 ? void 0 : _a.toSignificant(4)) !== null && _b !== void 0 ? _b : '-' : (_d = (_c = slippageAdjustedAmounts[actions_1.Field.INPUT]) === null || _c === void 0 ? void 0 : _c.toSignificant(4)) !== null && _d !== void 0 ? _d : '-'),
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, marginLeft: '4px' }, trade.tradeType === sdk_1.TradeType.EXACT_INPUT
                        ? trade.outputAmount.currency.symbol
                        : trade.inputAmount.currency.symbol))),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { color: theme.text2, fontSize: 14, fontWeight: 400 }, "Price Impact"),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "The difference between the market price and your price due to trade size." })),
                react_1.default.createElement(FormattedPriceImpact_1.default, { priceImpact: priceImpactWithoutFee })),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, "Liquidity Provider Fee"),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." })),
                react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14 }, realizedLPFee ? (realizedLPFee === null || realizedLPFee === void 0 ? void 0 : realizedLPFee.toSignificant(6)) + ' ' + trade.inputAmount.currency.symbol : '-'))),
        react_1.default.createElement(Row_1.AutoRow, null,
            react_1.default.createElement(Button_1.ButtonError, { onClick: onConfirm, disabled: disabledConfirm, error: severity > 2, style: { margin: '10px 0 0 0' }, id: "confirm-swap-or-send" },
                react_1.default.createElement(rebass_1.Text, { fontSize: 20, fontWeight: 500 }, severity > 2 ? 'Swap Anyway' : 'Confirm Swap')),
            swapErrorMessage ? react_1.default.createElement(styleds_1.SwapCallbackError, { error: swapErrorMessage }) : null)));
}
exports.default = SwapModalFooter;
