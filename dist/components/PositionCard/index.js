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
exports.MinimalPositionCard = exports.HoverCard = exports.FixedHeightRow = void 0;
const sdk_1 = require("@uniswap/sdk");
const polished_1 = require("polished");
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const react_router_dom_1 = require("react-router-dom");
const rebass_1 = require("rebass");
const styled_components_1 = __importDefault(require("styled-components"));
const TotalSupply_1 = require("../../data/TotalSupply");
const hooks_1 = require("../../hooks");
const hooks_2 = require("../../state/wallet/hooks");
const theme_1 = require("../../theme");
const currencyId_1 = require("../../utils/currencyId");
const wrappedCurrency_1 = require("../../utils/wrappedCurrency");
const Button_1 = require("../Button");
const polished_2 = require("polished");
const styled_1 = require("../earn/styled");
const useColor_1 = require("../../hooks/useColor");
const Card_1 = __importStar(require("../Card"));
const Column_1 = require("../Column");
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const DoubleLogo_1 = __importDefault(require("../DoubleLogo"));
const Row_1 = require("../Row");
const styleds_1 = require("../swap/styleds");
const constants_1 = require("../../constants");
exports.FixedHeightRow = styled_components_1.default(Row_1.RowBetween) `
  height: 24px;
`;
exports.HoverCard = styled_components_1.default(Card_1.default) `
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => polished_1.darken(0.06, theme.bg2)};
  }
`;
const StyledPositionCard = styled_components_1.default(Card_1.LightCard) `
  border: none;
  background: ${({ theme, bgColor }) => `radial-gradient(91.85% 100% at 1.84% 0%, ${polished_2.transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
`;
function MinimalPositionCard({ pair, showUnwrapped = false, border }) {
    const { account } = hooks_1.useActiveWeb3React();
    const currency0 = showUnwrapped ? pair.token0 : wrappedCurrency_1.unwrappedToken(pair.token0);
    const currency1 = showUnwrapped ? pair.token1 : wrappedCurrency_1.unwrappedToken(pair.token1);
    const [showMore, setShowMore] = react_1.useState(false);
    const userPoolBalance = hooks_2.useTokenBalance(account !== null && account !== void 0 ? account : undefined, pair.liquidityToken);
    const totalPoolTokens = TotalSupply_1.useTotalSupply(pair.liquidityToken);
    const poolTokenPercentage = !!userPoolBalance && !!totalPoolTokens && sdk_1.JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? new sdk_1.Percent(userPoolBalance.raw, totalPoolTokens.raw)
        : undefined;
    const [token0Deposited, token1Deposited] = !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? [
            pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
            pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
        : [undefined, undefined];
    return (react_1.default.createElement(react_1.default.Fragment, null, userPoolBalance && sdk_1.JSBI.greaterThan(userPoolBalance.raw, sdk_1.JSBI.BigInt(0)) ? (react_1.default.createElement(Card_1.GreyCard, { border: border },
        react_1.default.createElement(Column_1.AutoColumn, { gap: "12px" },
            react_1.default.createElement(exports.FixedHeightRow, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 16 }, "Your position"))),
            react_1.default.createElement(exports.FixedHeightRow, { onClick: () => setShowMore(!showMore) },
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(DoubleLogo_1.default, { currency0: currency0, currency1: currency1, margin: true, size: 20 }),
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 },
                        currency0.symbol,
                        "/",
                        currency1.symbol)),
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, userPoolBalance ? userPoolBalance.toSignificant(4) : '-'))),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "4px" },
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, "Your pool share:"),
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-')),
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 },
                        currency0.symbol,
                        ":"),
                    token0Deposited ? (react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500, marginLeft: '6px' }, token0Deposited === null || token0Deposited === void 0 ? void 0 : token0Deposited.toSignificant(6)))) : ('-')),
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 },
                        currency1.symbol,
                        ":"),
                    token1Deposited ? (react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500, marginLeft: '6px' }, token1Deposited === null || token1Deposited === void 0 ? void 0 : token1Deposited.toSignificant(6)))) : ('-')))))) : (react_1.default.createElement(Card_1.LightCard, null,
        react_1.default.createElement(theme_1.TYPE.subHeader, { style: { textAlign: 'center' } },
            react_1.default.createElement("span", { role: "img", "aria-label": "wizard-icon" }, "\u2B50\uFE0F"),
            ' ',
            "By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.")))));
}
exports.MinimalPositionCard = MinimalPositionCard;
function FullPositionCard({ pair, border, stakedBalance }) {
    const { account } = hooks_1.useActiveWeb3React();
    const currency0 = wrappedCurrency_1.unwrappedToken(pair.token0);
    const currency1 = wrappedCurrency_1.unwrappedToken(pair.token1);
    const [showMore, setShowMore] = react_1.useState(false);
    const userDefaultPoolBalance = hooks_2.useTokenBalance(account !== null && account !== void 0 ? account : undefined, pair.liquidityToken);
    const totalPoolTokens = TotalSupply_1.useTotalSupply(pair.liquidityToken);
    // if staked balance balance provided, add to standard liquidity amount
    const userPoolBalance = stakedBalance ? userDefaultPoolBalance === null || userDefaultPoolBalance === void 0 ? void 0 : userDefaultPoolBalance.add(stakedBalance) : userDefaultPoolBalance;
    const poolTokenPercentage = !!userPoolBalance && !!totalPoolTokens && sdk_1.JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? new sdk_1.Percent(userPoolBalance.raw, totalPoolTokens.raw)
        : undefined;
    const [token0Deposited, token1Deposited] = !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? [
            pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
            pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
        : [undefined, undefined];
    const backgroundColor = useColor_1.useColor(pair === null || pair === void 0 ? void 0 : pair.token0);
    return (react_1.default.createElement(StyledPositionCard, { border: border, bgColor: backgroundColor },
        react_1.default.createElement(styled_1.CardNoise, null),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "12px" },
            react_1.default.createElement(exports.FixedHeightRow, null,
                react_1.default.createElement(Row_1.AutoRow, { gap: "8px" },
                    react_1.default.createElement(DoubleLogo_1.default, { currency0: currency0, currency1: currency1, size: 20 }),
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, !currency0 || !currency1 ? react_1.default.createElement(styleds_1.Dots, null, "Loading") : `${currency0.symbol}/${currency1.symbol}`)),
                react_1.default.createElement(Row_1.RowFixed, { gap: "8px" },
                    react_1.default.createElement(Button_1.ButtonEmpty, { padding: "6px 8px", borderRadius: "12px", width: "fit-content", onClick: () => setShowMore(!showMore) }, showMore ? (react_1.default.createElement(react_1.default.Fragment, null,
                        "Manage",
                        react_1.default.createElement(react_feather_1.ChevronUp, { size: "20", style: { marginLeft: '10px' } }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                        "Manage",
                        react_1.default.createElement(react_feather_1.ChevronDown, { size: "20", style: { marginLeft: '10px' } })))))),
            showMore && (react_1.default.createElement(Column_1.AutoColumn, { gap: "8px" },
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, "Your total pool tokens:"),
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, userPoolBalance ? userPoolBalance.toSignificant(4) : '-')),
                stakedBalance && (react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, "Pool tokens in rewards pool:"),
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, stakedBalance.toSignificant(4)))),
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 },
                            "Pooled ",
                            currency0.symbol,
                            ":")),
                    token0Deposited ? (react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500, marginLeft: '6px' }, token0Deposited === null || token0Deposited === void 0 ? void 0 : token0Deposited.toSignificant(6)),
                        react_1.default.createElement(CurrencyLogo_1.default, { size: "20px", style: { marginLeft: '8px' }, currency: currency0 }))) : ('-')),
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 },
                            "Pooled ",
                            currency1.symbol,
                            ":")),
                    token1Deposited ? (react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500, marginLeft: '6px' }, token1Deposited === null || token1Deposited === void 0 ? void 0 : token1Deposited.toSignificant(6)),
                        react_1.default.createElement(CurrencyLogo_1.default, { size: "20px", style: { marginLeft: '8px' }, currency: currency1 }))) : ('-')),
                react_1.default.createElement(exports.FixedHeightRow, null,
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, "Your pool share:"),
                    react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, poolTokenPercentage
                        ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                        : '-')),
                react_1.default.createElement(Button_1.ButtonSecondary, { padding: "8px", borderRadius: "8px" },
                    react_1.default.createElement(theme_1.ExternalLink, { style: { width: '100%', textAlign: 'center' }, href: `https://uniswap.info/account/${account}` },
                        "View accrued fees and analytics",
                        react_1.default.createElement("span", { style: { fontSize: '11px' } }, "\u2197"))),
                userDefaultPoolBalance && sdk_1.JSBI.greaterThan(userDefaultPoolBalance.raw, constants_1.BIG_INT_ZERO) && (react_1.default.createElement(Row_1.RowBetween, { marginTop: "10px" },
                    react_1.default.createElement(Button_1.ButtonPrimary, { padding: "8px", borderRadius: "8px", as: react_router_dom_1.Link, to: `/add/${currencyId_1.currencyId(currency0)}/${currencyId_1.currencyId(currency1)}`, width: "48%" }, "Add"),
                    react_1.default.createElement(Button_1.ButtonPrimary, { padding: "8px", borderRadius: "8px", as: react_router_dom_1.Link, width: "48%", to: `/remove/${currencyId_1.currencyId(currency0)}/${currencyId_1.currencyId(currency1)}` }, "Remove"))),
                stakedBalance && sdk_1.JSBI.greaterThan(stakedBalance.raw, constants_1.BIG_INT_ZERO) && (react_1.default.createElement(Button_1.ButtonPrimary, { padding: "8px", borderRadius: "8px", as: react_router_dom_1.Link, to: `/uni/${currencyId_1.currencyId(currency0)}/${currencyId_1.currencyId(currency1)}`, width: "100%" }, "Manage Liquidity in Rewards Pool")))))));
}
exports.default = FullPositionCard;
