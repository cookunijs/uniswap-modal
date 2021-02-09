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
exports.CurrencySearch = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const react_ga_1 = __importDefault(require("react-ga"));
const react_i18next_1 = require("react-i18next");
const rebass_1 = require("rebass");
const hooks_1 = require("../../hooks");
const Tokens_1 = require("../../hooks/Tokens");
const theme_1 = require("../../theme");
const utils_1 = require("../../utils");
const Column_1 = __importDefault(require("../Column"));
const Row_1 = __importStar(require("../Row"));
const CommonBases_1 = __importDefault(require("./CommonBases"));
const CurrencyList_1 = __importDefault(require("./CurrencyList"));
const filtering_1 = require("./filtering");
const sorting_1 = require("./sorting");
const styleds_1 = require("./styleds");
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const styled_components_1 = __importDefault(require("styled-components"));
const useToggle_1 = __importDefault(require("hooks/useToggle"));
const useOnClickOutside_1 = require("hooks/useOnClickOutside");
const useTheme_1 = __importDefault(require("hooks/useTheme"));
const ImportRow_1 = __importDefault(require("./ImportRow"));
const react_feather_1 = require("react-feather");
const Button_1 = require("components/Button");
const ContentWrapper = styled_components_1.default(Column_1.default) `
  width: 100%;
  flex: 1 1;
  position: relative;
`;
const Footer = styled_components_1.default.div `
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${({ theme }) => theme.bg1};
  border-top: 1px solid ${({ theme }) => theme.bg2};
`;
function CurrencySearch({ selectedCurrency, onCurrencySelect, otherSelectedCurrency, showCommonBases, onDismiss, isOpen, showManageView, showImportView, setImportToken }) {
    const { t } = react_i18next_1.useTranslation();
    const { chainId } = hooks_1.useActiveWeb3React();
    const theme = useTheme_1.default();
    // refs for fixed size lists
    const fixedList = react_1.useRef();
    const [searchQuery, setSearchQuery] = react_1.useState('');
    const [invertSearchOrder] = react_1.useState(false);
    const allTokens = Tokens_1.useAllTokens();
    // const inactiveTokens: Token[] | undefined = useFoundOnInactiveList(searchQuery)
    // if they input an address, use it
    const isAddressSearch = utils_1.isAddress(searchQuery);
    const searchToken = Tokens_1.useToken(searchQuery);
    const searchTokenIsAdded = Tokens_1.useIsUserAddedToken(searchToken);
    react_1.useEffect(() => {
        if (isAddressSearch) {
            react_ga_1.default.event({
                category: 'Currency Select',
                action: 'Search by address',
                label: isAddressSearch
            });
        }
    }, [isAddressSearch]);
    const showETH = react_1.useMemo(() => {
        const s = searchQuery.toLowerCase().trim();
        return s === '' || s === 'e' || s === 'et' || s === 'eth';
    }, [searchQuery]);
    const tokenComparator = sorting_1.useTokenComparator(invertSearchOrder);
    const filteredTokens = react_1.useMemo(() => {
        return filtering_1.filterTokens(Object.values(allTokens), searchQuery);
    }, [allTokens, searchQuery]);
    const filteredSortedTokens = react_1.useMemo(() => {
        const sorted = filteredTokens.sort(tokenComparator);
        const symbolMatch = searchQuery
            .toLowerCase()
            .split(/\s+/)
            .filter(s => s.length > 0);
        if (symbolMatch.length > 1) {
            return sorted;
        }
        return [
            // sort any exact symbol matches first
            ...sorted.filter(token => { var _a; return ((_a = token.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === symbolMatch[0]; }),
            // sort by tokens whos symbols start with search substrng
            ...sorted.filter(token => {
                var _a, _b;
                return ((_a = token.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) &&
                    ((_b = token.symbol) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== symbolMatch[0];
            }),
            // rest that dont match upove
            ...sorted.filter(token => {
                var _a, _b;
                return !((_a = token.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) &&
                    ((_b = token.symbol) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== symbolMatch[0];
            })
        ];
    }, [filteredTokens, searchQuery, tokenComparator]);
    const handleCurrencySelect = react_1.useCallback((currency) => {
        onCurrencySelect(currency);
        onDismiss();
    }, [onDismiss, onCurrencySelect]);
    // clear the input on open
    react_1.useEffect(() => {
        if (isOpen)
            setSearchQuery('');
    }, [isOpen]);
    // manage focus on modal show
    const inputRef = react_1.useRef();
    const handleInput = react_1.useCallback(event => {
        var _a;
        const input = event.target.value;
        const checksummedInput = utils_1.isAddress(input);
        setSearchQuery(checksummedInput || input);
        (_a = fixedList.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0);
    }, []);
    const handleEnter = react_1.useCallback((e) => {
        var _a;
        if (e.key === 'Enter') {
            const s = searchQuery.toLowerCase().trim();
            if (s === 'eth') {
                handleCurrencySelect(sdk_1.ETHER);
            }
            else if (filteredSortedTokens.length > 0) {
                if (((_a = filteredSortedTokens[0].symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === searchQuery.trim().toLowerCase() ||
                    filteredSortedTokens.length === 1) {
                    handleCurrencySelect(filteredSortedTokens[0]);
                }
            }
        }
    }, [filteredSortedTokens, handleCurrencySelect, searchQuery]);
    // menu ui
    const [open, toggle] = useToggle_1.default(false);
    const node = react_1.useRef();
    useOnClickOutside_1.useOnClickOutside(node, open ? toggle : undefined);
    // if no results on main list, show option to expand into inactive
    const [showExpanded, setShowExpanded] = react_1.useState(false);
    const inactiveTokens = Tokens_1.useFoundOnInactiveList(searchQuery);
    // reset expanded results on query reset
    react_1.useEffect(() => {
        if (searchQuery === '') {
            setShowExpanded(false);
        }
    }, [setShowExpanded, searchQuery]);
    return (react_1.default.createElement(ContentWrapper, null,
        react_1.default.createElement(styleds_1.PaddedColumn, { gap: "16px" },
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 16 }, "Select a token"),
                react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss })),
            react_1.default.createElement(Row_1.default, null,
                react_1.default.createElement(styleds_1.SearchInput, { type: "text", id: "token-search-input", placeholder: t('tokenSearchPlaceholder'), autoComplete: "off", value: searchQuery, ref: inputRef, onChange: handleInput, onKeyDown: handleEnter })),
            showCommonBases && (react_1.default.createElement(CommonBases_1.default, { chainId: chainId, onSelect: handleCurrencySelect, selectedCurrency: selectedCurrency }))),
        react_1.default.createElement(styleds_1.Separator, null),
        searchToken && !searchTokenIsAdded ? (react_1.default.createElement(Column_1.default, { style: { padding: '20px 0', height: '100%' } },
            react_1.default.createElement(ImportRow_1.default, { token: searchToken, showImportView: showImportView, setImportToken: setImportToken }))) : (filteredSortedTokens === null || filteredSortedTokens === void 0 ? void 0 : filteredSortedTokens.length) > 0 || (showExpanded && inactiveTokens && inactiveTokens.length > 0) ? (react_1.default.createElement("div", { style: { flex: '1' } },
            react_1.default.createElement(react_virtualized_auto_sizer_1.default, { disableWidth: true }, ({ height }) => (react_1.default.createElement(CurrencyList_1.default, { height: height, showETH: showETH, currencies: showExpanded && inactiveTokens ? filteredSortedTokens.concat(inactiveTokens) : filteredSortedTokens, onCurrencySelect: handleCurrencySelect, otherCurrency: otherSelectedCurrency, selectedCurrency: selectedCurrency, fixedListRef: fixedList, showImportView: showImportView, setImportToken: setImportToken }))))) : (react_1.default.createElement(Column_1.default, { style: { padding: '20px', height: '100%' } },
            react_1.default.createElement(theme_1.TYPE.main, { color: theme.text3, textAlign: "center", mb: "20px" }, "No results found in active lists."),
            inactiveTokens &&
                inactiveTokens.length > 0 &&
                !(searchToken && !searchTokenIsAdded) &&
                searchQuery.length > 1 &&
                (filteredSortedTokens === null || filteredSortedTokens === void 0 ? void 0 : filteredSortedTokens.length) === 0 && (
            // expand button in line with no results
            react_1.default.createElement(Row_1.default, { align: "center", width: "100%", justify: "center" },
                react_1.default.createElement(Button_1.ButtonLight, { width: "fit-content", borderRadius: "12px", padding: "8px 12px", onClick: () => setShowExpanded(!showExpanded) }, !showExpanded
                    ? `Show ${inactiveTokens.length} more inactive ${inactiveTokens.length === 1 ? 'token' : 'tokens'}`
                    : 'Hide expanded search'))))),
        inactiveTokens &&
            inactiveTokens.length > 0 &&
            !(searchToken && !searchTokenIsAdded) &&
            (searchQuery.length > 1 || showExpanded) &&
            ((filteredSortedTokens === null || filteredSortedTokens === void 0 ? void 0 : filteredSortedTokens.length) !== 0 || showExpanded) && (
        // button fixed to bottom
        react_1.default.createElement(Row_1.default, { align: "center", width: "100%", justify: "center", style: { position: 'absolute', bottom: '80px', left: 0 } },
            react_1.default.createElement(Button_1.ButtonLight, { width: "fit-content", borderRadius: "12px", padding: "8px 12px", onClick: () => setShowExpanded(!showExpanded) }, !showExpanded
                ? `Show ${inactiveTokens.length} more inactive ${inactiveTokens.length === 1 ? 'token' : 'tokens'}`
                : 'Hide expanded search'))),
        react_1.default.createElement(Footer, null,
            react_1.default.createElement(Row_1.default, { justify: "center" },
                react_1.default.createElement(theme_1.ButtonText, { onClick: showManageView, color: theme.blue1, className: "list-token-manage-button" },
                    react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(theme_1.IconWrapper, { size: "16px", marginRight: "6px" },
                            react_1.default.createElement(react_feather_1.Edit, null)),
                        react_1.default.createElement(theme_1.TYPE.main, { color: theme.blue1 }, "Manage")))))));
}
exports.CurrencySearch = CurrencySearch;
