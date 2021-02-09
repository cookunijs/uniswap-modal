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
exports.ImportToken = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const theme_1 = require("theme");
const Card_1 = __importDefault(require("components/Card"));
const Column_1 = require("components/Column");
const Row_1 = require("components/Row");
const CurrencyLogo_1 = __importDefault(require("components/CurrencyLogo"));
const react_feather_1 = require("react-feather");
const polished_1 = require("polished");
const useTheme_1 = __importDefault(require("hooks/useTheme"));
const Button_1 = require("components/Button");
const styleds_1 = require("components/swap/styleds");
const hooks_1 = require("state/user/hooks");
const utils_1 = require("utils");
const hooks_2 = require("hooks");
const components_1 = require("../../theme/components");
const hooks_3 = require("state/lists/hooks");
const ListLogo_1 = __importDefault(require("components/ListLogo"));
const styleds_2 = require("./styleds");
const Wrapper = styled_components_1.default.div `
  position: relative;
  width: 100%;
  overflow: auto;
`;
const WarningWrapper = styled_components_1.default(Card_1.default) `
  background-color: ${({ theme, highWarning }) => highWarning ? polished_1.transparentize(0.8, theme.red1) : polished_1.transparentize(0.8, theme.yellow2)};
  width: fit-content;
`;
const AddressText = styled_components_1.default(theme_1.TYPE.blue) `
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    font-size: 10px;
`}
`;
function ImportToken({ tokens, onBack, onDismiss, handleCurrencySelect }) {
    var _a, _b, _c, _d, _e, _f;
    const theme = useTheme_1.default();
    const { chainId } = hooks_2.useActiveWeb3React();
    const [confirmed, setConfirmed] = react_1.useState(false);
    const addToken = hooks_1.useAddUserToken();
    // use for showing import source on inactive tokens
    const inactiveTokenList = hooks_3.useCombinedInactiveList();
    // higher warning severity if either is not on a list
    const fromLists = (chainId && ((_c = (_a = inactiveTokenList === null || inactiveTokenList === void 0 ? void 0 : inactiveTokenList[chainId]) === null || _a === void 0 ? void 0 : _a[(_b = tokens[0]) === null || _b === void 0 ? void 0 : _b.address]) === null || _c === void 0 ? void 0 : _c.list)) ||
        (chainId && ((_f = (_d = inactiveTokenList === null || inactiveTokenList === void 0 ? void 0 : inactiveTokenList[chainId]) === null || _d === void 0 ? void 0 : _d[(_e = tokens[1]) === null || _e === void 0 ? void 0 : _e.address]) === null || _f === void 0 ? void 0 : _f.list));
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(styleds_2.PaddedColumn, { gap: "14px", style: { width: '100%', flex: '1 1' } },
            react_1.default.createElement(Row_1.RowBetween, null,
                onBack ? react_1.default.createElement(react_feather_1.ArrowLeft, { style: { cursor: 'pointer' }, onClick: onBack }) : react_1.default.createElement("div", null),
                react_1.default.createElement(theme_1.TYPE.mediumHeader, null,
                    "Import ",
                    tokens.length > 1 ? 'Tokens' : 'Token'),
                onDismiss ? react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss }) : react_1.default.createElement("div", null))),
        react_1.default.createElement(styleds_1.SectionBreak, null),
        react_1.default.createElement(styleds_2.PaddedColumn, { gap: "md" },
            tokens.map(token => {
                var _a, _b;
                const list = chainId && ((_b = (_a = inactiveTokenList === null || inactiveTokenList === void 0 ? void 0 : inactiveTokenList[chainId]) === null || _a === void 0 ? void 0 : _a[token.address]) === null || _b === void 0 ? void 0 : _b.list);
                return (react_1.default.createElement(Card_1.default, { backgroundColor: theme.bg2, key: 'import' + token.address, className: ".token-warning-container" },
                    react_1.default.createElement(Column_1.AutoColumn, { gap: "10px" },
                        react_1.default.createElement(Row_1.AutoRow, { align: "center" },
                            react_1.default.createElement(CurrencyLogo_1.default, { currency: token, size: '24px' }),
                            react_1.default.createElement(theme_1.TYPE.body, { ml: "8px", mr: "8px", fontWeight: 500 }, token.symbol),
                            react_1.default.createElement(theme_1.TYPE.darkGray, { fontWeight: 300 }, token.name)),
                        chainId && (react_1.default.createElement(components_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, token.address, 'address') },
                            react_1.default.createElement(AddressText, null, token.address))),
                        list !== undefined ? (react_1.default.createElement(Row_1.RowFixed, null,
                            list.logoURI && react_1.default.createElement(ListLogo_1.default, { logoURI: list.logoURI, size: "12px" }),
                            react_1.default.createElement(theme_1.TYPE.small, { ml: "6px", color: theme.text3 },
                                "via ",
                                list.name))) : (react_1.default.createElement(WarningWrapper, { borderRadius: "4px", padding: "4px", highWarning: true },
                            react_1.default.createElement(Row_1.RowFixed, null,
                                react_1.default.createElement(react_feather_1.AlertTriangle, { stroke: theme.red1, size: "10px" }),
                                react_1.default.createElement(theme_1.TYPE.body, { color: theme.red1, ml: "4px", fontSize: "10px", fontWeight: 500 }, "Unknown Source")))))));
            }),
            react_1.default.createElement(Card_1.default, { style: { backgroundColor: fromLists ? polished_1.transparentize(0.8, theme.yellow2) : polished_1.transparentize(0.8, theme.red1) } },
                react_1.default.createElement(Column_1.AutoColumn, { justify: "center", style: { textAlign: 'center', gap: '16px', marginBottom: '12px' } },
                    react_1.default.createElement(react_feather_1.AlertTriangle, { stroke: fromLists ? theme.yellow2 : theme.red1, size: 32 }),
                    react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 600, fontSize: 20, color: fromLists ? theme.yellow2 : theme.red1 }, "Trade at your own risk!")),
                react_1.default.createElement(Column_1.AutoColumn, { style: { textAlign: 'center', gap: '16px', marginBottom: '12px' } },
                    react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 400, color: fromLists ? theme.yellow2 : theme.red1 }, "Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects."),
                    react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 600, color: fromLists ? theme.yellow2 : theme.red1 }, "If you purchase this token, you may not be able to sell it back.")),
                react_1.default.createElement(Row_1.AutoRow, { justify: "center", style: { cursor: 'pointer' }, onClick: () => setConfirmed(!confirmed) },
                    react_1.default.createElement(styleds_2.Checkbox, { className: ".understand-checkbox", name: "confirmed", type: "checkbox", checked: confirmed, onChange: () => setConfirmed(!confirmed) }),
                    react_1.default.createElement(theme_1.TYPE.body, { ml: "10px", fontSize: "16px", color: fromLists ? theme.yellow2 : theme.red1, fontWeight: 500 }, "I understand"))),
            react_1.default.createElement(Button_1.ButtonPrimary, { disabled: !confirmed, altDisabledStyle: true, borderRadius: "20px", padding: "10px 1rem", onClick: () => {
                    tokens.map(token => addToken(token));
                    handleCurrencySelect && handleCurrencySelect(tokens[0]);
                }, className: ".token-dismiss-button" }, "Import"))));
}
exports.ImportToken = ImportToken;
