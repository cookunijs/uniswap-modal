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
const react_window_1 = require("react-window");
const rebass_1 = require("rebass");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../hooks");
const hooks_2 = require("../../state/lists/hooks");
const hooks_3 = require("../../state/wallet/hooks");
const theme_1 = require("../../theme");
const Tokens_1 = require("../../hooks/Tokens");
const Column_1 = __importDefault(require("../Column"));
const Row_1 = require("../Row");
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const Tooltip_1 = require("../Tooltip");
const styleds_1 = require("./styleds");
const Loader_1 = __importDefault(require("../Loader"));
const utils_1 = require("../../utils");
const ImportRow_1 = __importDefault(require("./ImportRow"));
const wrappedCurrency_1 = require("utils/wrappedCurrency");
function currencyKey(currency) {
    return currency instanceof sdk_1.Token ? currency.address : currency === sdk_1.ETHER ? 'ETHER' : '';
}
const StyledBalanceText = styled_components_1.default(rebass_1.Text) `
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;
const Tag = styled_components_1.default.div `
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;
function Balance({ balance }) {
    return react_1.default.createElement(StyledBalanceText, { title: balance.toExact() }, balance.toSignificant(4));
}
const TagContainer = styled_components_1.default.div `
  display: flex;
  justify-content: flex-end;
`;
function TokenTags({ currency }) {
    if (!(currency instanceof hooks_2.WrappedTokenInfo)) {
        return react_1.default.createElement("span", null);
    }
    const tags = currency.tags;
    if (!tags || tags.length === 0)
        return react_1.default.createElement("span", null);
    const tag = tags[0];
    return (react_1.default.createElement(TagContainer, null,
        react_1.default.createElement(Tooltip_1.MouseoverTooltip, { text: tag.description },
            react_1.default.createElement(Tag, { key: tag.id }, tag.name)),
        tags.length > 1 ? (react_1.default.createElement(Tooltip_1.MouseoverTooltip, { text: tags
                .slice(1)
                .map(({ name, description }) => `${name}: ${description}`)
                .join('; \n') },
            react_1.default.createElement(Tag, null, "..."))) : null));
}
function CurrencyRow({ currency, onSelect, isSelected, otherSelected, style }) {
    const { account } = hooks_1.useActiveWeb3React();
    const key = currencyKey(currency);
    const selectedTokenList = hooks_2.useCombinedActiveList();
    const isOnSelectedList = utils_1.isTokenOnList(selectedTokenList, currency);
    const customAdded = Tokens_1.useIsUserAddedToken(currency);
    const balance = hooks_3.useCurrencyBalance(account !== null && account !== void 0 ? account : undefined, currency);
    // only show add or remove buttons if not on selected list
    return (react_1.default.createElement(styleds_1.MenuItem, { style: style, className: `token-item-${key}`, onClick: () => (isSelected ? null : onSelect()), disabled: isSelected, selected: otherSelected },
        react_1.default.createElement(CurrencyLogo_1.default, { currency: currency, size: '24px' }),
        react_1.default.createElement(Column_1.default, null,
            react_1.default.createElement(rebass_1.Text, { title: currency.name, fontWeight: 500 }, currency.symbol),
            react_1.default.createElement(theme_1.TYPE.darkGray, { ml: "0px", fontSize: '12px', fontWeight: 300 },
                currency.name,
                " ",
                !isOnSelectedList && customAdded && '• Added by user')),
        react_1.default.createElement(TokenTags, { currency: currency }),
        react_1.default.createElement(Row_1.RowFixed, { style: { justifySelf: 'flex-end' } }, balance ? react_1.default.createElement(Balance, { balance: balance }) : account ? react_1.default.createElement(Loader_1.default, null) : null)));
}
function CurrencyList({ height, currencies, selectedCurrency, onCurrencySelect, otherCurrency, fixedListRef, showETH, showImportView, setImportToken }) {
    const itemData = react_1.useMemo(() => (showETH ? [sdk_1.Currency.ETHER, ...currencies] : currencies), [currencies, showETH]);
    const { chainId } = hooks_1.useActiveWeb3React();
    const inactiveTokens = Tokens_1.useAllInactiveTokens();
    const Row = react_1.useCallback(({ data, index, style }) => {
        const currency = data[index];
        const isSelected = Boolean(selectedCurrency && sdk_1.currencyEquals(selectedCurrency, currency));
        const otherSelected = Boolean(otherCurrency && sdk_1.currencyEquals(otherCurrency, currency));
        const handleSelect = () => onCurrencySelect(currency);
        const token = wrappedCurrency_1.wrappedCurrency(currency, chainId);
        const showImport = inactiveTokens && token && Object.keys(inactiveTokens).includes(token.address);
        if (showImport && token) {
            return (react_1.default.createElement(ImportRow_1.default, { style: style, token: token, showImportView: showImportView, setImportToken: setImportToken, dim: true }));
        }
        else {
            return (react_1.default.createElement(CurrencyRow, { style: style, currency: currency, isSelected: isSelected, onSelect: handleSelect, otherSelected: otherSelected }));
        }
    }, [chainId, inactiveTokens, onCurrencySelect, otherCurrency, selectedCurrency, setImportToken, showImportView]);
    const itemKey = react_1.useCallback((index, data) => currencyKey(data[index]), []);
    return (react_1.default.createElement(react_window_1.FixedSizeList, { height: height, ref: fixedListRef, width: "100%", itemData: itemData, itemCount: itemData.length, itemSize: 56, itemKey: itemKey }, Row));
}
exports.default = CurrencyList;
