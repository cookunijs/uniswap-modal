"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Row_1 = require("components/Row");
const Column_1 = require("components/Column");
const CurrencyLogo_1 = __importDefault(require("components/CurrencyLogo"));
const theme_1 = require("theme");
const ListLogo_1 = __importDefault(require("components/ListLogo"));
const hooks_1 = require("hooks");
const hooks_2 = require("state/lists/hooks");
const useTheme_1 = __importDefault(require("hooks/useTheme"));
const Button_1 = require("components/Button");
const styled_components_1 = __importDefault(require("styled-components"));
const Tokens_1 = require("hooks/Tokens");
const react_feather_1 = require("react-feather");
const TokenSection = styled_components_1.default.div `
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.6' : '1')};
`;
const CheckIcon = styled_components_1.default(react_feather_1.CheckCircle) `
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.green1};
`;
const NameOverflow = styled_components_1.default.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`;
function ImportRow({ token, style, dim, showImportView, setImportToken }) {
    var _a, _b;
    // gloabls
    const { chainId } = hooks_1.useActiveWeb3React();
    const theme = useTheme_1.default();
    // check if token comes from list
    const inactiveTokenList = hooks_2.useCombinedInactiveList();
    const list = chainId && ((_b = (_a = inactiveTokenList === null || inactiveTokenList === void 0 ? void 0 : inactiveTokenList[chainId]) === null || _a === void 0 ? void 0 : _a[token.address]) === null || _b === void 0 ? void 0 : _b.list);
    // check if already active on list or local storage tokens
    const isAdded = Tokens_1.useIsUserAddedToken(token);
    const isActive = Tokens_1.useIsTokenActive(token);
    return (react_1.default.createElement(TokenSection, { style: style },
        react_1.default.createElement(CurrencyLogo_1.default, { currency: token, size: '24px', style: { opacity: dim ? '0.6' : '1' } }),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "4px", style: { opacity: dim ? '0.6' : '1' } },
            react_1.default.createElement(Row_1.AutoRow, null,
                react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500 }, token.symbol),
                react_1.default.createElement(theme_1.TYPE.darkGray, { ml: "8px", fontWeight: 300 },
                    react_1.default.createElement(NameOverflow, { title: token.name }, token.name))),
            list && list.logoURI && (react_1.default.createElement(Row_1.RowFixed, null,
                react_1.default.createElement(theme_1.TYPE.small, { mr: "4px", color: theme.text3 },
                    "via ",
                    list.name),
                react_1.default.createElement(ListLogo_1.default, { logoURI: list.logoURI, size: "12px" })))),
        !isActive && !isAdded ? (react_1.default.createElement(Button_1.ButtonPrimary, { width: "fit-content", padding: "6px 12px", fontWeight: 500, fontSize: "14px", onClick: () => {
                setImportToken && setImportToken(token);
                showImportView();
            } }, "Import")) : (react_1.default.createElement(Row_1.RowFixed, { style: { minWidth: 'fit-content' } },
            react_1.default.createElement(CheckIcon, null),
            react_1.default.createElement(theme_1.TYPE.main, { color: theme.green1 }, "Active")))));
}
exports.default = ImportRow;
