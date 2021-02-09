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
const styled_components_1 = __importDefault(require("styled-components"));
const token_logo_png_1 = __importDefault(require("../../assets/images/token-logo.png"));
const constants_1 = require("../../constants");
const TotalSupply_1 = require("../../data/TotalSupply");
const hooks_1 = require("../../hooks");
const useContract_1 = require("../../hooks/useContract");
const useCurrentBlockTimestamp_1 = __importDefault(require("../../hooks/useCurrentBlockTimestamp"));
const hooks_2 = require("../../state/stake/hooks");
const hooks_3 = require("../../state/wallet/hooks");
const theme_1 = require("../../theme");
const computeUniCirculation_1 = require("../../utils/computeUniCirculation");
const useUSDCPrice_1 = __importDefault(require("../../utils/useUSDCPrice"));
const Column_1 = require("../Column");
const Row_1 = require("../Row");
const styled_1 = require("../earn/styled");
const ContentWrapper = styled_components_1.default(Column_1.AutoColumn) `
  width: 100%;
`;
const ModalUpper = styled_components_1.default(styled_1.DataCard) `
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
  padding: 0.5rem;
`;
const StyledClose = styled_components_1.default(react_feather_1.X) `
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`;
/**
 * Content for balance stats modal
 */
function UniBalanceContent({ setShowUniBalanceModal }) {
    var _a, _b;
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const uni = chainId ? constants_1.UNI[chainId] : undefined;
    const total = hooks_3.useAggregateUniBalance();
    const uniBalance = hooks_3.useTokenBalance(account !== null && account !== void 0 ? account : undefined, uni);
    const uniToClaim = hooks_2.useTotalUniEarned();
    const totalSupply = TotalSupply_1.useTotalSupply(uni);
    const uniPrice = useUSDCPrice_1.default(uni);
    const blockTimestamp = useCurrentBlockTimestamp_1.default();
    const unclaimedUni = hooks_3.useTokenBalance((_a = useContract_1.useMerkleDistributorContract()) === null || _a === void 0 ? void 0 : _a.address, uni);
    const circulation = react_1.useMemo(() => blockTimestamp && uni && chainId === sdk_1.ChainId.MAINNET
        ? computeUniCirculation_1.computeUniCirculation(uni, blockTimestamp, unclaimedUni)
        : totalSupply, [blockTimestamp, chainId, totalSupply, unclaimedUni, uni]);
    return (react_1.default.createElement(ContentWrapper, { gap: "lg" },
        react_1.default.createElement(ModalUpper, null,
            react_1.default.createElement(styled_1.CardBGImage, null),
            react_1.default.createElement(styled_1.CardNoise, null),
            react_1.default.createElement(styled_1.CardSection, { gap: "md" },
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "Your UNI Breakdown"),
                    react_1.default.createElement(StyledClose, { stroke: "white", onClick: () => setShowUniBalanceModal(false) }))),
            react_1.default.createElement(styled_1.Break, null),
            account && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(styled_1.CardSection, { gap: "sm" },
                    react_1.default.createElement(Column_1.AutoColumn, { gap: "md", justify: "center" },
                        react_1.default.createElement(theme_1.UniTokenAnimated, { width: "48px", src: token_logo_png_1.default }),
                        ' ',
                        react_1.default.createElement(theme_1.TYPE.white, { fontSize: 48, fontWeight: 600, color: "white" }, total === null || total === void 0 ? void 0 : total.toFixed(2, { groupSeparator: ',' }))),
                    react_1.default.createElement(Column_1.AutoColumn, { gap: "md" },
                        react_1.default.createElement(Row_1.RowBetween, null,
                            react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "Balance:"),
                            react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, uniBalance === null || uniBalance === void 0 ? void 0 : uniBalance.toFixed(2, { groupSeparator: ',' }))),
                        react_1.default.createElement(Row_1.RowBetween, null,
                            react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "Unclaimed:"),
                            react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, uniToClaim === null || uniToClaim === void 0 ? void 0 :
                                uniToClaim.toFixed(4, { groupSeparator: ',' }),
                                ' ',
                                uniToClaim && uniToClaim.greaterThan('0') && (react_1.default.createElement(theme_1.StyledInternalLink, { onClick: () => setShowUniBalanceModal(false), to: "/uni" }, "(claim)")))))),
                react_1.default.createElement(styled_1.Break, null))),
            react_1.default.createElement(styled_1.CardSection, { gap: "sm" },
                react_1.default.createElement(Column_1.AutoColumn, { gap: "md" },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "UNI price:"),
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" },
                            "$", (_b = uniPrice === null || uniPrice === void 0 ? void 0 : uniPrice.toFixed(2)) !== null && _b !== void 0 ? _b : '-')),
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "UNI in circulation:"),
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, circulation === null || circulation === void 0 ? void 0 : circulation.toFixed(0, { groupSeparator: ',' }))),
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, "Total Supply"),
                        react_1.default.createElement(theme_1.TYPE.white, { color: "white" }, totalSupply === null || totalSupply === void 0 ? void 0 : totalSupply.toFixed(0, { groupSeparator: ',' }))),
                    uni && uni.chainId === sdk_1.ChainId.MAINNET ? (react_1.default.createElement(theme_1.ExternalLink, { href: `https://uniswap.info/token/${uni.address}` }, "View UNI Analytics")) : null)))));
}
exports.default = UniBalanceContent;
