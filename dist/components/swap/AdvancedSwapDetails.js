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
exports.AdvancedSwapDetails = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const actions_1 = require("../../state/swap/actions");
const hooks_1 = require("../../state/user/hooks");
const theme_1 = require("../../theme");
const prices_1 = require("../../utils/prices");
const Column_1 = require("../Column");
const QuestionHelper_1 = __importDefault(require("../QuestionHelper"));
const Row_1 = require("../Row");
const FormattedPriceImpact_1 = __importDefault(require("./FormattedPriceImpact"));
const SwapRoute_1 = __importDefault(require("./SwapRoute"));
const InfoLink = styled_components_1.default(theme_1.ExternalLink) `
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`;
function TradeSummary({ trade, allowedSlippage }) {
    var _a, _b, _c, _d;
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const { priceImpactWithoutFee, realizedLPFee } = prices_1.computeTradePriceBreakdown(trade);
    const isExactIn = trade.tradeType === sdk_1.TradeType.EXACT_INPUT;
    const slippageAdjustedAmounts = prices_1.computeSlippageAdjustedAmounts(trade, allowedSlippage);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Column_1.AutoColumn, { style: { padding: '0 16px' } },
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, isExactIn ? 'Minimum received' : 'Maximum sold'),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." })),
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { color: theme.text1, fontSize: 14 }, isExactIn
                        ? (_b = `${(_a = slippageAdjustedAmounts[actions_1.Field.OUTPUT]) === null || _a === void 0 ? void 0 : _a.toSignificant(4)} ${trade.outputAmount.currency.symbol}`) !== null && _b !== void 0 ? _b : '-' : (_d = `${(_c = slippageAdjustedAmounts[actions_1.Field.INPUT]) === null || _c === void 0 ? void 0 : _c.toSignificant(4)} ${trade.inputAmount.currency.symbol}`) !== null && _d !== void 0 ? _d : '-'))),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, "Price Impact"),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "The difference between the market price and estimated price due to trade size." })),
                react_1.default.createElement(FormattedPriceImpact_1.default, { priceImpact: priceImpactWithoutFee })),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, "Liquidity Provider Fee"),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." })),
                react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, color: theme.text1 }, realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-')))));
}
function AdvancedSwapDetails({ trade }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const [allowedSlippage] = hooks_1.useUserSlippageTolerance();
    const showRoute = Boolean(trade && trade.route.path.length > 2);
    return (react_1.default.createElement(Column_1.AutoColumn, { gap: "0px" }, trade && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TradeSummary, { trade: trade, allowedSlippage: allowedSlippage }),
        showRoute && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Row_1.RowBetween, { style: { padding: '0 16px' } },
                react_1.default.createElement("span", { style: { display: 'flex', alignItems: 'center' } },
                    react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, "Route"),
                    react_1.default.createElement(QuestionHelper_1.default, { text: "Routing through these tokens resulted in the best price for your trade." })),
                react_1.default.createElement(SwapRoute_1.default, { trade: trade })))),
        !showRoute && (react_1.default.createElement(Column_1.AutoColumn, { style: { padding: '12px 16px 0 16px' } },
            react_1.default.createElement(InfoLink, { href: 'https://uniswap.info/pair/' + trade.route.pairs[0].liquidityToken.address, target: "_blank" }, "View pair analytics \u2197")))))));
}
exports.AdvancedSwapDetails = AdvancedSwapDetails;
